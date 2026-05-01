import {Router} from 'express';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createProject, updateProject } from './controllers/project.controller.js';
import { createProjectValidator, updateProjectValidator } from './validators/project.validator.js';


const projectRoutes = Router();
projectRoutes.use(authMiddleware);

projectRoutes.post('/', validate(createProjectValidator), createProject);
projectRoutes.put('/:id', validate(updateProjectValidator), updateProject);



export default projectRoutes;