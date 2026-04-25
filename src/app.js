import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';


import userRouter from './routes/user.routes.js';
import clientRouter from './routes/client.routes.js';
import projectRouter from './routes/project.routes.js';
import deliveryNoteRouter from './routes/deliverynote.routes.js';
import { notFound, errorHandler } from './middleware/error-handler.js';

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

app.use(mongoSanitize());


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
app.use('/api/client', clientRouter);
app.use('/api/project', projectRouter);
app.use('/api/deliverynote', deliveryNoteRouter);

app.use(notFound);
app.use(errorHandler);

export default app;