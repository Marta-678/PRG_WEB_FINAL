import mongoose from 'mongoose';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  dbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

let server;

const startServer = async () => {
  try {
    await dbConnect();

    server = app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error arrancando el servidor:', error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} recibido. Cerrando servidor...`);

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

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();









// export const validateConfig = () => {
//   const requiredVars = ['DB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

//   const missingVars = requiredVars.filter((key) => !process.env[key]);

//   if (missingVars.length > 0) {
//     console.error(`Faltan variables de entorno: ${missingVars.join(', ')}`);
//     process.exit(1);
//   }
// };

// mongoose.connection.on('connected', () => {
//   console.log('Conectado a la BBDD');
// });

// mongoose.connection.on('disconnected', () => {
//   console.warn('MongoDB desconectado');
// });

// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('Conexión MongoDB cerrada');
//   process.exit(0);
// });

// export const dbConnect = async () => {
//   if (!config.dbUri) {
//     throw new Error('DB_URI no está definida');
//   }

//   try {
//     await mongoose.connect(config.dbUri);
//   } catch (error) {
//     console.error('Error conectando a la BD:', error.message);
//     process.exit(1);
//   }
// };