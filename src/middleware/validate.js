import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (parsed.body) {
      req.body = parsed.body;
    }

    if (parsed.params) {
      Object.assign(req.params, parsed.params);
    }

    req.validatedData = parsed;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        AppError.badRequest(
          'Error de validación',
          error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        )
      );
    }

    return next(error);
  }
};