import AppError from '../utils/AppError.js';

export const notFound = (req, res, next) => {
  return next(AppError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  console.error('ERROR HANDLER:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
      ...(err.details && Array.isArray(err.details) && { details: err.details }),
    });
  }

  // Error de validación de Mongoose (campo único duplicado)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    return res.status(409).json({
      ok: false,
      message: `Ya existe un registro con ese ${field}`,
    });
  }

  return res.status(500).json({
    ok: false,
    message: err?.message || 'Error interno del servidor',
  });
};