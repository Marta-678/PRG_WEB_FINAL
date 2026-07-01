import AppError from '../utils/AppError.js';
import { sendErrorToSlack } from '../services/logger.service.js';

export const notFound = (req, res, next) => {
  next(AppError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = async (err, req, res, next) => {
  let error = err;

  if (err.name === 'CastError') {
    error = AppError.badRequest(`ID no válido: ${err.value}`);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    error = AppError.conflict(`Ya existe un registro con ese ${field}`);
  }

  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = AppError.badRequest('Error de validación', details);
  }

  if (err.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo permitido'
        : 'Error al procesar el archivo';
    error = AppError.badRequest(message);
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;

  if (statusCode >= 500) {
    console.error('ERROR HANDLER:', err);
    await sendErrorToSlack(err, req);
  }

  res.status(statusCode).json({
    ok: false,
    message: statusCode >= 500 ? 'Error interno del servidor' : error.message,
    ...(error.details && Array.isArray(error.details) && { details: error.details }),
  });
};