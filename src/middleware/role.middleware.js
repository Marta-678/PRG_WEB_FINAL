import AppError from '../utils/AppError.js';

const checkRol = (roles) => (req, res, next) => {
  try {
    const { user } = req;
    const userRol = user.role;
    const checkValueRol = roles.includes(userRol);
    if (!checkValueRol) {
      return next(AppError.forbidden('No tienes permisos para realizar esta acción'));
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default checkRol;