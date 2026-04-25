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

const userRouter = Router();

// Públicas
userRouter.post('/register', validate(registerSchema), register);
userRouter.post('/login',    validate(loginSchema),    login);
userRouter.post('/refresh', validate(refreshTokenSchema), refreshToken);

// Requieren autenticación
userRouter.put('/validation', authMiddleware, validate(validateEmailSchema), validateEmail);
userRouter.put('/register',   authMiddleware, validate(personalDataSchema),  updatePersonalData);
userRouter.patch('/company',  authMiddleware, validate(companyDataSchema),   updateCompanyData);

userRouter.get('/',    authMiddleware, getProfile);
userRouter.post('/logout',    authMiddleware, logout);

userRouter.put('/password',   authMiddleware, validate(changePasswordSchema), changePassword);
userRouter.delete('/',  authMiddleware, deleteProfile);

// Solo admins pueden invitar
userRouter.post('/invite', authMiddleware, checkRol(['admin']), validate(inviteUserSchema), inviteUser);

// Logo — multer procesa el multipart/form-data
userRouter.patch('/logo', authMiddleware, upload.single('logo'), updateCompanyLogo);

export default userRouter;