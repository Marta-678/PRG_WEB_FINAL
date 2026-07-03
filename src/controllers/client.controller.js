import mongoose from 'mongoose';
import Client from '../models/Client.js';
import AppError from '../utils/AppError.js';
import { emitToCompany } from '../socket/socket.js';

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`El id '${id}' no es válido`);
  }
};

const findClientInCompany = async (id, companyId, includeDeleted = false) => {
  assertValidId(id);

  const filter = { _id: id, company: companyId };
  if (!includeDeleted) filter.deleted = false;

  const client = await Client.findOne(filter);
  if (!client) {
    throw AppError.notFound('Cliente no encontrado');
  }

  return client;
};

export const createClient = async (req, res, next) => {
  try {
    const { name, cif, email, phone, address } = req.body;
    const companyId = req.user.company;

    if (!companyId) {
      return next(AppError.badRequest('Debes tener una compañía asignada para crear clientes'));
    }

    const existing = await Client.findOne({ cif, company: companyId, deleted: false });
    if (existing) {
      return next(AppError.conflict('Ya existe un cliente con ese CIF en tu compañía'));
    }

    const client = await Client.create({
      user: req.user._id,
      company: companyId,
      name,
      cif,
      email,
      phone,
      address,
    });

    emitToCompany(companyId, 'client:new', client);

    res.status(201).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
};

export const replaceClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, cif, email, phone, address } = req.body;
    const companyId = req.user.company;

    const client = await Client.findOne({ _id: id, company: companyId, deleted: false });
    if (!client) {
      return next(AppError.notFound('Cliente no encontrado'));
    }

    if (cif !== client.cif) {
      const existing = await Client.findOne({ cif, company: companyId, deleted: false });
      if (existing) {
        return next(AppError.conflict('Ya existe un cliente con ese CIF en tu compañía'));
      }
    }

    client.name = name;
    client.cif = cif;
    client.email = email;
    client.phone = phone;
    client.address = address;

    await client.save();

    res.status(200).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
};

export const patchClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, cif, email, phone, address } = req.body;
    const companyId = req.user.company;

    const client = await Client.findOne({ _id: id, company: companyId, deleted: false });
    if (!client) {
      return next(AppError.notFound('Cliente no encontrado'));
    }

    if (cif && cif !== client.cif) {
      const existing = await Client.findOne({ cif, company: companyId, deleted: false });
      if (existing) {
        return next(AppError.conflict('Ya existe un cliente con ese CIF en tu compañía'));
      }
    }

    client.name = name ?? client.name;
    client.cif = cif ?? client.cif;
    client.email = email ?? client.email;
    client.phone = phone ?? client.phone;
    client.address = address ?? client.address;

    await client.save();

    res.status(200).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
};

export const getClients = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const { page = 1, limit = 10, name, sort = '-createdAt' } = req.query;

    const filter = { company: companyId, deleted: false };
    if (name) filter.name = { $regex: name, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [clients, totalItems] = await Promise.all([
      Client.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Client.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        clients,
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

export const getClientById = async (req, res, next) => {
  try {
    const client = await findClientInCompany(req.params.id, req.user.company);
    res.status(200).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company;
    const soft = req.query.soft === 'true';

    const client = await findClientInCompany(id, companyId);

    if (soft) {
      client.deleted = true;
      await client.save();
      return res.status(200).json({
        status: 'success',
        message: 'Cliente archivado correctamente',
        data: { client },
      });
    }

    await Client.deleteOne({ _id: id, company: companyId });
    res.status(200).json({ status: 'success', message: 'Cliente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

export const getArchivedClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ company: req.user.company, deleted: true }).sort('-updatedAt');
    res.status(200).json({ status: 'success', data: { clients } });
  } catch (error) {
    next(error);
  }
};

export const restoreClient = async (req, res, next) => {
  try {
    const client = await findClientInCompany(req.params.id, req.user.company, true);

    if (!client.deleted) {
      return next(AppError.badRequest('El cliente no está archivado'));
    }

    client.deleted = false;
    await client.save();

    res.status(200).json({
      status: 'success',
      message: 'Cliente restaurado correctamente',
      data: { client },
    });
  } catch (error) {
    next(error);
  }
};