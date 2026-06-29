import mongoose from 'mongoose';

const dbConnect = async () => {
  const dbUri = process.env.DB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!dbUri) {
    throw new Error('No se ha definido DB_URI, MONGO_URI o DATABASE_URL en las variables de entorno');
  }

  await mongoose.connect(dbUri);

  console.log('MongoDB conectado correctamente');
};

export default dbConnect;