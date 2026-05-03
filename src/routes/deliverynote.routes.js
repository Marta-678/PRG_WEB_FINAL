import {Router} from 'express';
import {authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { uploadImage } from '../middleware/upload.js';  
import { createDeliveryNote } from '../controllers/deliverynote.controller.js';
import { createDeliveryNoteSchema } from '../validators/deliverynote.validator.js';

const deliveryNoteRoutes = Router();

deliveryNoteRoutes.post('/', authMiddleware, validate(createDeliveryNoteSchema), createDeliveryNote);
export default deliveryNoteRoutes;