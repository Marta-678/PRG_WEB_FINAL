import {Router} from 'express';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import * as projectController from '../controllers/project.controller.js';
import {createProjectValidator, updateProjectValidator, projectIdValidator, listProjectsValidator} from '../validators/project.validator.js';


const projectRoutes = Router();
projectRoutes.use(authMiddleware);

projectRoutes.post('/', validate(createProjectValidator), projectController.createProject);
projectRoutes.put('/:id', validate(updateProjectValidator), projectController.updateProject);
projectRoutes.get('/', validate(listProjectsValidator), projectController.getProjects);
projectRoutes.get('/:id', validate(projectIdValidator), projectController.getProjectById);
projectRoutes.get('/archived',projectController.getArchivedProjects);
projectRoutes.delete('/:id', validate(projectIdValidator), projectController.deleteProject);
projectRoutes.patch('/:id/restore', validate(projectIdValidator, projectController.restoreProject))


export default projectRoutes;