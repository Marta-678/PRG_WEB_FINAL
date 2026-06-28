import mongose from 'mongoose';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import AppError from '../utils/AppError.js';

// hacer que valide tabien su es valido el id antes de buscar si exxiste 

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest(`El id '${id}' no es válido`);
  }
};

const getCompanyId = (req) => req.user?.company || req.companyId;

const findProjectInCompany = async (id, companyId, { includeDeleted = false } = {}) => {
  assertValidId(id);

  const filter = { _id: id, company: companyId };

  if (!includeDeleted) {
    filter.deleted = false;
  }

  const project = await Project.findOne(filter).populate('client', 'name cif email phone');

  if (!project) {
    throw AppError.notFound('Proyecto no encontrado');
  }

  return project;
};

export const createProject = async (req, res, next) => {
  try {
    const { name, projectCode, address, email, notes, clientId, active } = req.body;

    const companyId = getCompanyId(req);

    if (!companyId) {
      return next(AppError.badRequest('Debes tener una compañía asignada para crear proyectos'));
    }

    const existing = await Project.findOne({
      projectCode,
      company: companyId,
      deleted: false,
    });

    if (existing) {
      return next(AppError.conflict('Ya existe un proyecto con ese código en tu compañía'));
    }

    const client = await Client.findOne({
      _id: clientId,
      company: companyId,
      deleted: false,
    });

    if (!client) {
      return next(AppError.badRequest('Cliente no encontrado o no pertenece a tu compañía'));
    }
    const project = await Project.create({
      user: req.user._id,
      company: companyId,
      client: clientId,
      name,
      projectCode,
      address,
      email,
      notes,
      active: active ?? true,
      deleted: false,
    });

    res.status(201).json({
      status: 'success',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// A modificar 
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

export const getProjects = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    const {
      page = 1,
      limit = 10,
      client,
      name,
      active,
      sort = '-createdAt',
    } = req.query;

    const filter = {
      company: companyId,
      deleted: false,
    };

    if (client) {
      filter.client = client;
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (active !== undefined) {
      filter.active = active === 'true';
    }
    const skip = (Number(page) - 1) * Number(limit);

    const [projects, totalItems] = await Promise.all([
      Project.find(filter)
        .populate('client', 'name cif email phone')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        projects,
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

export const getProjectById = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    const project = await findProjectInCompany(req.params.id, companyId);

    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProject = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    const { id } = req.params;
    const soft = req.query.soft === 'true';

    const project = await findProjectInCompany(id, companyId);

    if (soft) {
      project.deleted = true;
      await project.save();

      return res.status(200).json({
        status: 'success',
        message: 'Proyecto archivado correctamente',
        data: { project },
      });
    }

    await Project.deleteOne({ _id: id, company: companyId });

    res.status(200).json({
      status: 'success',
      message: 'Proyecto eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

export const getArchivedProjects = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);

    const projects = await Project.find({
      company: companyId,
      deleted: true,
    })
      .populate('client', 'name cif email phone')
      .sort('-updatedAt');

    res.status(200).json({
      status: 'success',
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

export const restoreProject = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    const project = await findProjectInCompany(req.params.id, companyId, {
      includeDeleted: true,
    });

    if (!project.deleted) {
      return next(AppError.badRequest('El proyecto no está archivado'));
    }

    project.deleted = false;
    await project.save();

    res.status(200).json({
      status: 'success',
      message: 'Proyecto restaurado correctamente',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};


