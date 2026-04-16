// Archivo que arranca el servidor 

import app from './app.js';
import { config, dbConnect, validateConfig } from './config/index.js';


async function startServer() {
  try {
    validateConfig();
    await dbConnect();

    app.listen(config.port, () => {
      console.log(`Servidor en http://localhost:${config.port}`);
      console.log(`Health check en http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('Error al iniciar la app:', error.message);
    process.exit(1);
  }
};

startServer();