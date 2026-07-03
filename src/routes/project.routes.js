import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import * as projectController from '../controllers/project.controller.js';
import {
  createProjectValidator,
  updateProjectValidator,
  replaceProjectValidator,
  projectIdValidator,
  listProjectsValidator,
} from '../validators/project.validator.js';

const router = Router();

/**
 * @swagger
 * /api/project:
 *   post:
 *     tags: [Project]
 *     summary: Crear un proyecto
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Proyecto creado }
 *       400: { description: Error de validación }
 *       409: { description: Código de proyecto duplicado }
 *   get:
 *     tags: [Project]
 *     summary: Listar proyectos con paginación y filtros
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: client
 *         schema: { type: string }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de proyectos }
 */
router.post('/', authMiddleware, validate(createProjectValidator), projectController.createProject);
router.get('/', authMiddleware, validate(listProjectsValidator), projectController.getProjects);

/**
 * @swagger
 * /api/project/archived:
 *   get:
 *     tags: [Project]
 *     summary: Listar proyectos archivados
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de proyectos archivados }
 */
router.get('/archived', authMiddleware, projectController.getArchivedProjects);

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     tags: [Project]
 *     summary: Obtener un proyecto
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Proyecto encontrado }
 *       404: { description: Proyecto no encontrado }
 *   put:
 *     tags: [Project]
 *     summary: Actualizar un proyecto
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Proyecto actualizado }
 *       404: { description: Proyecto no encontrado }
 *   delete:
 *     tags: [Project]
 *     summary: Archivar o borrar un proyecto
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: soft
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: Proyecto archivado o eliminado }
 */
router.get('/:id', authMiddleware, validate(projectIdValidator), projectController.getProjectById);
router.put('/:id', authMiddleware, validate(replaceProjectValidator), projectController.replaceProject);
router.patch('/:id', authMiddleware, validate(updateProjectValidator), projectController.patchProject);
router.delete('/:id', authMiddleware, validate(projectIdValidator), projectController.deleteProject);

/**
 * @swagger
 * /api/project/{id}/restore:
 *   patch:
 *     tags: [Project]
 *     summary: Restaurar un proyecto archivado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Proyecto restaurado }
 *       400: { description: El proyecto no está archivado }
 */
router.patch('/:id/restore', authMiddleware, validate(projectIdValidator), projectController.restoreProject);

export default router;