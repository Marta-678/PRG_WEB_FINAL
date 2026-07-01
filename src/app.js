import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import rateLimiter from './middleware/rate-limit.js';
import sanitize from './middleware/sanitize.js';
import { notFound, errorHandler } from './middleware/error-handler.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sanitize);

app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.status(200).json({ ok: true, message: 'API BildyApp funcionando' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;