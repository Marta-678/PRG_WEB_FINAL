import http from 'node:http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app.js';
import { config, validateConfig } from './config/index.js';
import dbConnect from './config/database.js';
import { initSocket } from './socket/socket.js';

let server;
let io;

const start = async () => {
  try {
    validateConfig();
    await dbConnect();

    server = http.createServer(app);
    io = new Server(server, {
      cors: { origin: config.clientUrl === '*' ? true : config.clientUrl },
    });
    initSocket(io);
    app.set('io', io);

    server.listen(config.port, () => {
      console.log(`Servidor en http://localhost:${config.port}`);
      console.log(`Health check en http://localhost:${config.port}/health`);
      console.log(`Swagger en http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error('Error al iniciar la app:', error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} recibido, cerrando servidor...`);

  if (io) io.close();

  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });
  } else {
    await mongoose.connection.close();
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();