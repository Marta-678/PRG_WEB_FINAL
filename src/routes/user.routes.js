import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import checkRol from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/upload.js';
import * as userController from '../controllers/user.controller.js';
import {
  registerSchema,
  loginSchema,
  validateEmailSchema,
  personalDataSchema,
  companyDataSchema,
  changePasswordSchema,
  inviteUserSchema,
  refreshTokenSchema,
} from '../validators/user.validator.js';

const {
  register,
  validateEmail,
  login,
  updatePersonalData,
  updateCompanyData,
  refreshToken,
  logout,
  getProfile,
  changePassword,
  deleteProfile,
  inviteUser,
  updateCompanyLogo,
} = userController;

const router = Router();

// Públicas
router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

// Requieren autenticación
router.put('/validation', authMiddleware, validate(validateEmailSchema), validateEmail);
router.put('/register',   authMiddleware, validate(personalDataSchema),  updatePersonalData);
router.patch('/company',  authMiddleware, validate(companyDataSchema),   updateCompanyData);

router.get('/',    authMiddleware, getProfile);
router.post('/logout',    authMiddleware, logout);

router.put('/password',   authMiddleware, validate(changePasswordSchema), changePassword);
router.delete('/',  authMiddleware, deleteProfile);

// Solo admins pueden invitar
router.post('/invite', authMiddleware, checkRol(['admin']), validate(inviteUserSchema), inviteUser);

// Logo — multer procesa el multipart/form-data
router.patch('/logo', authMiddleware, upload.single('logo'), updateCompanyLogo);

export default router;