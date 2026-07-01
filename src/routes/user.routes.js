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

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [User]
 *     summary: Registrar un nuevo usuario
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *   put:
 *     tags: [User]
 *     summary: Completar datos personales del usuario
 *     responses:
 *       200: { description: Datos actualizados }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 */
userRouter.post('/register', validate(registerSchema), register);
userRouter.put('/register', authMiddleware, validate(personalDataSchema), updatePersonalData);

/**
 * @swagger
 * /api/user/validation:
 *   put:
 *     tags: [User]
 *     summary: Validar el email con el código recibido
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Email validado }
 *       400: { $ref: '#/components/responses/ValidationError' }
 */
userRouter.put('/validation', authMiddleware, validate(validateEmailSchema), validateEmail);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [User]
 *     summary: Login de usuario
 *     security: []
 *     responses:
 *       200: { description: Login correcto, devuelve token JWT }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 */
userRouter.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/user/refresh:
 *   post:
 *     tags: [User]
 *     summary: Renovar el token JWT
 *     security: []
 *     responses:
 *       200: { description: Token renovado }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 */
userRouter.post('/refresh', validate(refreshTokenSchema), refreshToken);

/**
 * @swagger
 * /api/user/company:
 *   patch:
 *     tags: [User]
 *     summary: Crear o actualizar la compañía del usuario
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Compañía actualizada }
 */
userRouter.patch('/company', authMiddleware, validate(companyDataSchema), updateCompanyData);

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [User]
 *     summary: Obtener el usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Usuario autenticado }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *   delete:
 *     tags: [User]
 *     summary: Eliminar el usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Usuario eliminado }
 */
userRouter.get('/', authMiddleware, getProfile);
userRouter.delete('/', authMiddleware, deleteProfile);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     tags: [User]
 *     summary: Cerrar sesión
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Sesión cerrada }
 */
userRouter.post('/logout', authMiddleware, logout);

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     tags: [User]
 *     summary: Cambiar la contraseña
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Contraseña actualizada }
 */
userRouter.put('/password', authMiddleware, validate(changePasswordSchema), changePassword);

/**
 * @swagger
 * /api/user/invite:
 *   post:
 *     tags: [User]
 *     summary: Invitar a un usuario a la compañía (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Usuario invitado }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 */
userRouter.post('/invite', authMiddleware, checkRol(['admin']), validate(inviteUserSchema), inviteUser);

/**
 * @swagger
 * /api/user/logo:
 *   patch:
 *     tags: [User]
 *     summary: Subir el logo de la compañía
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo: { type: string, format: binary }
 *     responses:
 *       200: { description: Logo actualizado }
 */
userRouter.patch('/logo', authMiddleware, upload.single('logo'), updateCompanyLogo);

export default userRouter;