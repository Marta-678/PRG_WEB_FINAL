import {Router} from 'express';
import {authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { uploadImage } from '../middleware/upload.js';  
import * as deliveryNoteController from '../controllers/deliverynote.controller.js';
import { createDeliveryNoteValidator,updateDeliveryNoteValidator,deliveryNoteIdValidator,listDeliveryNotesValidator } from '../validators/deliverynote.validator.js';

const deliveryNoteRoutes = Router();

deliveryNoteRoutes.post('/', authMiddleware, validate(createDeliveryNoteValidator), deliveryNoteController.createDeliveryNote);
deliveryNoteRoutes.get('/', authMiddleware, validate(listDeliveryNotesValidator), deliveryNoteController.getDeliveryNotes);
deliveryNoteRoutes.get('/:id', authMiddleware, validate(deliveryNoteIdValidator), deliveryNoteController.getDeliveryNoteById);
deliveryNoteRoutes.get('/pdf/:id', authMiddleware, validate(deliveryNoteIdValidator), deliveryNoteController.getDeliveryNotePdf);
deliveryNoteRoutes.patch('/:id/sign', authMiddleware, validate(deliveryNoteIdValidator), deliveryNoteController.signDeliveryNote);
deliveryNoteRoutes.delete('/:id', authMiddleware, validate(deliveryNoteIdValidator), deliveryNoteController.deleteDeliveryNote);

export default deliveryNoteRoutes;