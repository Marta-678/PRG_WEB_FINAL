import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { uploadImage as uploadSignature } from '../middleware/upload.js';
import * as deliveryNoteController from '../controllers/deliverynote.controller.js';
import {
  createDeliveryNoteValidator,
  deliveryNoteIdValidator,
  listDeliveryNotesValidator,
} from '../validators/deliverynote.validator.js';

const router = Router();

/**
 * @swagger
 * /api/deliverynote:
 *   post:
 *     tags: [DeliveryNote]
 *     summary: Crear un albarán
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Albarán creado }
 *       400: { description: Error de validación }
 *   get:
 *     tags: [DeliveryNote]
 *     summary: Listar albaranes con paginación y filtros
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: project
 *         schema: { type: string }
 *       - in: query
 *         name: client
 *         schema: { type: string }
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [material, hours] }
 *       - in: query
 *         name: signed
 *         schema: { type: boolean }
 *       - in: query
 *         name: from
 *         schema: { type: string }
 *       - in: query
 *         name: to
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de albaranes }
 */
router.post('/', authMiddleware, validate(createDeliveryNoteValidator), deliveryNoteController.createDeliveryNote);
router.get('/', authMiddleware, validate(listDeliveryNotesValidator), deliveryNoteController.getDeliveryNotes);

/**
 * @swagger
 * /api/deliverynote/archived:
 *   get:
 *     tags: [DeliveryNote]
 *     summary: Listar albaranes archivados
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de albaranes archivados }
 */
router.get('/archived', authMiddleware, deliveryNoteController.getArchivedDeliveryNotes);

/**
 * @swagger
 * /api/deliverynote/pdf/{id}:
 *   get:
 *     tags: [DeliveryNote]
 *     summary: Descargar el albarán en PDF
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: PDF generado }
 *       302: { description: Redirección al PDF ya firmado y subido a la nube }
 *       404: { description: Albarán no encontrado }
 */
router.get('/pdf/:id', authMiddleware, validate(deliveryNoteIdValidator), deliveryNoteController.getDeliveryNotePdf);

/**
 * @swagger
 * /api/deliverynote/{id}/sign:
 *   patch:
 *     tags: [DeliveryNote]
 *     summary: Firmar un albarán con imagen multipart/form-data (campo 'signature')
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Albarán firmado }
 *       400: { description: Firma requerida o albarán ya firmado }
 */
router.patch(
  '/:id/sign',
  authMiddleware,
  uploadSignature.single('signature'),
  validate(deliveryNoteIdValidator),
  deliveryNoteController.signDeliveryNote
);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     tags: [DeliveryNote]
 *     summary: Obtener un albarán
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Albarán encontrado }
 *       404: { description: Albarán no encontrado }
 *   delete:
 *     tags: [DeliveryNote]
 *     summary: Borrar un albarán no firmado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Albarán eliminado }
 *       400: { description: No se puede borrar un albarán firmado }
 */
router.get('/:id', authMiddleware, validate(deliveryNoteIdValidator), deliveryNoteController.getDeliveryNoteById);
router.delete('/:id', authMiddleware, validate(deliveryNoteIdValidator), deliveryNoteController.deleteDeliveryNote);

export default router;