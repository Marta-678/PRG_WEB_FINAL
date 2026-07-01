import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import * as clientController from '../controllers/client.controller.js';
import {
  createClientValidator,
  updateClientValidator,
  clientIdValidator,
  listClientsValidator,
} from '../validators/client.validator.js';

const router = Router();

/**
 * @swagger
 * /api/client:
 *   post:
 *     tags: [Client]
 *     summary: Crear un cliente
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Cliente creado }
 *       400: { description: Error de validación }
 *       409: { description: CIF duplicado }
 *   get:
 *     tags: [Client]
 *     summary: Listar clientes con paginación y filtros
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de clientes }
 */
router.post('/', authMiddleware, validate(createClientValidator), clientController.createClient);
router.get('/', authMiddleware, validate(listClientsValidator), clientController.getClients);

/**
 * @swagger
 * /api/client/archived:
 *   get:
 *     tags: [Client]
 *     summary: Listar clientes archivados
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de clientes archivados }
 */
router.get('/archived', authMiddleware, clientController.getArchivedClients);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     tags: [Client]
 *     summary: Obtener un cliente
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cliente encontrado }
 *       404: { description: Cliente no encontrado }
 *   put:
 *     tags: [Client]
 *     summary: Actualizar un cliente
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cliente actualizado }
 *       404: { description: Cliente no encontrado }
 *   delete:
 *     tags: [Client]
 *     summary: Archivar o borrar un cliente
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: soft
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: Cliente archivado o eliminado }
 */
router.get('/:id', authMiddleware, validate(clientIdValidator), clientController.getClientById);
router.put('/:id', authMiddleware, validate(updateClientValidator), clientController.updateClient);
router.delete('/:id', authMiddleware, validate(clientIdValidator), clientController.deleteClient);

/**
 * @swagger
 * /api/client/{id}/restore:
 *   patch:
 *     tags: [Client]
 *     summary: Restaurar un cliente archivado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cliente restaurado }
 *       400: { description: El cliente no está archivado }
 */
router.patch('/:id/restore', authMiddleware, validate(clientIdValidator), clientController.restoreClient);

export default router;