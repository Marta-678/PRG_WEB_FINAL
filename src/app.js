import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import mongoSanitize from 'express-mongo-sanitize';


import userRouter from './routes/user.routes.js';
import clientRoutes from './routes/client.routes.js';
import { notFound, errorHandler } from './middleware/error-handler.js';

import projectRoutes from './routes/project.routes.js';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(mongoSanitize());


app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'API BildyApp funcionando',
  });
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    ok: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res, next) => {
  console.log('METHOD:', req.method, 'URL:', req.originalUrl);
  next();
});

app.use('/api/user',userRouter);
app.use('/api/client', clientRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/deliverynote', deliveryNoteRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;