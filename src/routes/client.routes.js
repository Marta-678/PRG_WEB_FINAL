import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import * as clientController from '../controllers/client.controller.js';
import {createClientSchema,updateClientSchema,clientIdSchema,listClientsSchema} from '../validators/client.validator.js';

const clientRoutes = Router();

// TODO: mirar si hay crear el cliente desde cliente tengo que poner el token?
lientRoutes.use(authMiddleware);

clientRoutes.get('/archived', clientController.getArchivedClients);
clientRoutes.get('/', validate(listClientsSchema), clientController.getClients);
clientRoutes.get('/:id', validate(clientIdSchema), clientController.getClientById);
clientRoutes.post('/', validate(createClientSchema), clientController.createClient);
clientRoutes.put('/:id', validate(updateClientSchema), clientController.updateClient);
clientRoutes.delete('/:id', validate(clientIdSchema), clientController.deleteClient);
clientRoutes.patch('/:id/restore', validate(clientIdSchema), clientController.restoreClient);


export default clientRoutes;