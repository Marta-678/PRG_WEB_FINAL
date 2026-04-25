import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import * as clientController from '../controllers/client.controller.js';
import { createClientSchema, updateClientSchema } from '../validators/client.validator.js';

const clientRouter = Router();

const { createClient, updateClient } = clientController;

clientRouter.post('/', authMiddleware, validate(createClientSchema), createClient);
clientRouter.put('/:id', authMiddleware, validate(updateClientSchema), updateClient);

export default clientRouter;