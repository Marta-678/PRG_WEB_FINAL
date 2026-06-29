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

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo permitido'
        : 'Error al procesar el archivo';

    return res.status(400).json({
      ok: false,
      message,
    });
  }
  
 if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({
      ok: false,
      message: 'Error de validación',
      details,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      ok: false,
      message: `ID no válido: ${err.value}`,
    });
  }
};