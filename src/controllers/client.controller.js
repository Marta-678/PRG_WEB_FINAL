import mongoose from 'mongoose';
import Client from '../models/Client.js';
import AppError from '../utils/AppError.js';


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
    const client = new Client({ name, cif, email, phone, address, companyId });
    await client.save();
    res.status(201).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
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