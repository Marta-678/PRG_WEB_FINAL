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

export const validateConfig = () => {
  const requiredVars = ['DB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error(`Faltan variables de entorno: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Conectado a la BBDD');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB desconectado');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Conexión MongoDB cerrada');
  process.exit(0);
});

export const dbConnect = async () => {
  if (!config.dbUri) {
    throw new Error('DB_URI no está definida');
  }

  try {
    await mongoose.connect(config.dbUri);
  } catch (error) {
    console.error('Error conectando a la BD:', error.message);
    process.exit(1);
  }
};