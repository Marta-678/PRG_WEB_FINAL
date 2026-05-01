import mongose from 'mongoose';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import AppError from '../utils/AppError.js';

// hacer que valide tabien su es valido el id antes de buscar si exxiste 

export const createProject = async (req, res, next) => {
  try {
    const { name, projectCode, address, email, notes, clientId } = req.body;
    const companyId = req.user.company;
    if (!companyId) {
      return next(AppError.badRequest('Debes tener una compañía asignada para crear proyectos'));
    }

    const existing = await Project.findOne({ projectCode, company: companyId, deleted: false });
    if (existing) {
      return next(AppError.conflict('Ya existe un proyecto con ese código en tu compañía'));
    }

    const client = await Client.findOne({ _id: clientId, company: companyId, deleted: false });
    if (!client) {
      return next(AppError.badRequest('Cliente no encontrado o no pertenece a tu compañía'));
    }

    const project = new Project({ name, projectCode, address, email, notes, client: clientId, company: companyId, user: req.user._id });
    await project.save();
    res.status(201).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, projectCode, address, email, notes, clientId } = req.body;
    const companyId = req.user.company;
    const project = await Project.findOne({ _id: id, company: companyId, deleted: false });
    if (!project) {
      return next(AppError.notFound('Proyecto no encontrado'));
    }
    if (projectCode && projectCode !== project.projectCode) {
      const existing = await Project.findOne({ projectCode, company: companyId, deleted: false });
      if (existing) {
        return next(AppError.conflict('Ya existe un proyecto con ese código en tu compañía'));
      }
    }
    if (clientId && clientId !== project.client.toString()) {
      const client = await Client.findOne({ _id: clientId, company: companyId, deleted: false });
      if (!client) {
        return next(AppError.badRequest('Cliente no encontrado o no pertenece a tu compañía'));
      }
    }
    project.name = name ?? project.name;
    project.projectCode = projectCode ?? project.projectCode;
    project.address = address ?? project.address;
    project.email = email ?? project.email;
    project.notes = notes ?? project.notes;
    project.client = clientId ?? project.client;
    await project.save();
    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};