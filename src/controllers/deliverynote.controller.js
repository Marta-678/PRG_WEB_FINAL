import mongoose from 'mongoose';
import DeliveryNote from '../models/DeliveryNote.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import {uploadImage } from '../services/storage.service.js';
import {generateAndUploadPdf} from '../services/pdf.service.js';

// TODO: me faltan cosas 


const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`El id '${id}' no es válido`);
  }
};
 
const POPULATE_FULL = [
  { path: 'client',  select: 'name cif email phone' },
  { path: 'project', select: 'name projectCode address' },
  { path: 'user',    select: 'name lastName email' },
  { path: 'company', select: 'name cif address logo' },
];

const findNoteInCompany = async (id, companyId, { includeDeleted = false } = {}) => {
  assertValidId(id);
  const filter = { _id: id, company: companyId };
  if (!includeDeleted) filter.deleted = false;
  const note = await DeliveryNote.findOne(filter);
  if (!note) throw AppError.notFound('Albarán no encontrado');
  return note;
};

export const createDeliveryNote = async (req, res) => {
  const { companyId } = req;
  const { client: clientId, project: projectId, format, description, workDate, material, quantity, unit, hours, workers } = req.body;
    assertValidId(clientId);
    assertValidId(projectId);
  const [client, project] = await Promise.all([
    Client.findOne({ _id: clientId, company: companyId }),
    Project.findOne({ _id: projectId, company: companyId }),
  ]);
  if (!client) throw AppError.badRequest('Cliente no encontrado');
    if (!project) throw AppError.badRequest('Proyecto no encontrado');
    const deliveryNote = new DeliveryNote({
    user: req.userId,
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
    signed: false,
    deleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await deliveryNote.save();
  res.status(201).json(deliveryNote);
};

export const getDeliveryNotes = async (req, res) => {
  const { companyId } = req;
  const notes = await DeliveryNote.find({ company: companyId, deleted: false }).populate(POPULATE_FULL);
  res.json(notes);
};

export const getDeliveryNoteById = async (req, res) => {
    const { companyId } = req;
    const { id } = req.params;
    const note = await findNoteInCompany(id, companyId);
    await note.populate(POPULATE_FULL);
    res.json(note);
};

export const getArchivedDeliveryNotes = async (req, res) => {
  const { companyId } = req;
  const notes = await DeliveryNote.find({ company: companyId, deleted: true }).populate(POPULATE_FULL);
  res.json(notes);
};

export const updateDeliveryNote = async (req, res) => {
    const { companyId } = req;
    const { id } = req.params;
    const note = await findNoteInCompany(id, companyId);    
    const { client: clientId, project: projectId, format, description, workDate, material, quantity, unit, hours, workers } = req.body; 
    if (clientId) {
        assertValidId(clientId);
        const client = await Client.findOne({ _id: clientId, company: companyId });
        if (!client) throw AppError.badRequest('Cliente no encontrado');
        note.client = clientId;
    }
    if (projectId) {
        assertValidId(projectId);
        const project = await Project.findOne({ _id: projectId, company: companyId });
        if (!project) throw AppError.badRequest('Proyecto no encontrado');
        note.project = projectId;
    }
    if (format) note.format = format;
    if (description) note.description = description;
    if (workDate) note.workDate = workDate; 
    if (format === 'material') {
        if (material) note.material = material;
        if (quantity) note.quantity = quantity;
        if (unit) note.unit = unit;
    }
    if (format === 'hours') {
        if (hours) note.hours = hours;
        if (workers) note.workers = workers;
    }   
    note.updatedAt = new Date();
    await note.save();
    res.json(note);
};

