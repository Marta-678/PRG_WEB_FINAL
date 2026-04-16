import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(AppError.unauthorized('No se proporcionó un token de autenticación'));
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(AppError.unauthorized('Token de autenticación no válido'));
        }
        // Verificar ANTES de usar decoded
        const decoded = jwt.verify(token, config.jwtSecret);
        // El token se firmó con { sub: user._id }, por eso usamos decoded.sub
        const user = await User.findOne({ _id: decoded.sub, deleted: false });
        if (!user) {
            return next(AppError.unauthorized('Usuario no encontrado'));
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(AppError.unauthorized('Token inválido o expirado'));
        }
        next(error);
    }
};