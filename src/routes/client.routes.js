import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import * as clientController from '../controllers/client.controller.js';
import { createClientSchema, updateClientSchema } from '../validators/client.validator.js';

const clientRoutes = Router();

const { createClient, updateClient } = clientController;

// TODO: mirar si hay crear el cliente desde cliente tengo que poner el token?
clientRoutes.post('/', validate(createClientSchema), createClient);
clientRoutes.put('/:id', validate(updateClientSchema), updateClient);

export default clientRoutes;