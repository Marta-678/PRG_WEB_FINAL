import mongoose from 'mongoose';
import sharp from 'sharp';
import DeliveryNote from '../models/DeliveryNote.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import AppError from '../utils/AppError.js';
import { uploadSignatureImage } from '../services/storage.service.js';
import { generateDeliveryNotePdfBuffer, generateAndUploadPdf } from '../services/pdf.service.js';
import { emitToCompany } from '../socket/socket.js';

const POPULATE_FULL = [
  { path: 'client', select: 'name cif email phone' },
  { path: 'project', select: 'name projectCode address' },
  { path: 'user', select: 'name lastName email' },
  { path: 'company', select: 'name cif address logo' },
];

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`El id '${id}' no es válido`);
  }
};

const findNoteInCompany = async (id, companyId, { includeDeleted = false } = {}) => {
  assertValidId(id);
  const filter = { _id: id, company: companyId };
  if (!includeDeleted) filter.deleted = false;

  const note = await DeliveryNote.findOne(filter).populate(POPULATE_FULL);
  if (!note) throw AppError.notFound('Albarán no encontrado');

  return note;
};

export const createDeliveryNote = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const {
      client: clientId,
      project: projectId,
      format,
      description,
      workDate,
      material,
      quantity,
      unit,
      hours,
      workers,
    } = req.body;

    const [client, project] = await Promise.all([
      Client.findOne({ _id: clientId, company: companyId, deleted: false }),
      Project.findOne({ _id: projectId, company: companyId, deleted: false }),
    ]);

    if (!client) return next(AppError.badRequest('Cliente no encontrado'));
    if (!project) return next(AppError.badRequest('Proyecto no encontrado'));
    if (project.client.toString() !== client._id.toString()) {
      return next(AppError.badRequest('El proyecto no pertenece a ese cliente'));
    }

    const deliveryNote = await DeliveryNote.create({
      user: req.user._id,
      company: companyId,
      client: clientId,
      project: projectId,
      format,
      description,
      workDate,
      material: format === 'material' ? material : undefined,
      quantity: format === 'material' ? quantity : undefined,
      unit: format === 'material' ? unit : undefined,
      hours: format === 'hours' ? hours : undefined,
      workers: format === 'hours' ? workers : undefined,
    });

    emitToCompany(companyId, 'deliverynote:new', deliveryNote);

    res.status(201).json({ status: 'success', data: { deliveryNote } });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryNotes = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const { page = 1, limit = 10, project, client, format, signed, from, to, sort = '-workDate' } = req.query;

    const filter = { company: companyId, deleted: false };
    if (project) filter.project = project;
    if (client) filter.client = client;
    if (format) filter.format = format;
    if (signed !== undefined) filter.signed = signed;
    if (from || to) {
      filter.workDate = {};
      if (from) filter.workDate.$gte = from;
      if (to) filter.workDate.$lte = to;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [deliveryNotes, totalItems] = await Promise.all([
      DeliveryNote.find(filter)
        .populate(POPULATE_FULL)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      DeliveryNote.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        deliveryNotes,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / Number(limit)),
          currentPage: Number(page),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryNoteById = async (req, res, next) => {
  try {
    const note = await findNoteInCompany(req.params.id, req.user.company);
    res.status(200).json({ status: 'success', data: { deliveryNote: note } });
  } catch (error) {
    next(error);
  }
};

export const getArchivedDeliveryNotes = async (req, res, next) => {
  try {
    const deliveryNotes = await DeliveryNote.find({ company: req.user.company, deleted: true })
      .populate(POPULATE_FULL)
      .sort('-updatedAt');

    res.status(200).json({ status: 'success', data: { deliveryNotes } });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryNotePdf = async (req, res, next) => {
  try {
    const note = await findNoteInCompany(req.params.id, req.user.company);

    if (note.signed && note.pdfUrl) {
      return res.redirect(note.pdfUrl);
    }

    const buffer = await generateDeliveryNotePdfBuffer(note);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=albaran-${note._id}.pdf`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const signDeliveryNote = async (req, res, next) => {
  try {
    const note = await findNoteInCompany(req.params.id, req.user.company);

    if (note.signed) {
      return next(AppError.badRequest('El albarán ya está firmado'));
    }

    if (!req.file) {
      return next(AppError.badRequest('La imagen de firma es obligatoria'));
    }

    const webpBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp()
      .toBuffer();

    const pngBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .png()
      .toBuffer();

    const { url: signatureUrl } = await uploadSignatureImage(webpBuffer);

    note.signatureUrl = signatureUrl;
    note.signed = true;
    note.signedAt = new Date();

    const pdfUrl = await generateAndUploadPdf(note, pngBuffer);
    note.pdfUrl = pdfUrl;

    await note.save();

    emitToCompany(req.user.company, 'deliverynote:signed', note);

    res.status(200).json({ status: 'success', message: 'Albarán firmado correctamente', data: { deliveryNote: note } });
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryNote = async (req, res, next) => {
  try {
    const note = await findNoteInCompany(req.params.id, req.user.company);

    if (note.signed) {
      return next(AppError.badRequest('No se puede borrar un albarán firmado'));
    }

    await DeliveryNote.deleteOne({ _id: note._id, company: req.user.company });

    res.status(200).json({ status: 'success', message: 'Albarán eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};