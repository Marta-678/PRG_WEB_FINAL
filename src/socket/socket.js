import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import User from '../models/User.js';

let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Token requerido'));
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findOne({ _id: decoded.sub, deleted: false });

      if (!user || !user.company) {
        return next(new Error('Usuario no válido'));
      }

      socket.user = user;
      socket.join(user.company.toString());
      next();
    } catch (error) {
      next(new Error('Autenticación inválida'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });

  return io;
};

export const emitToCompany = (companyId, event, payload) => {
  if (ioInstance && companyId) {
    ioInstance.to(companyId.toString()).emit(event, payload);
  }
};