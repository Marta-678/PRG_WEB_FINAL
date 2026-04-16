export default class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(message = 'Solicitud inválida', details = null) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = 'No autenticado') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'No autorizado') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new AppError(message, 404);
  }

  static conflict(message = 'Conflicto de datos') {
    return new AppError(message, 409);
  }

  static tooManyRequests(message = 'Demasiadas solicitudes') {
    return new AppError(message, 429);
  }

  static internal(message = 'Error interno del servidor') {
    return new AppError(message, 500);
  }
}