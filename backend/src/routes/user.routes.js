import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/', authenticate, authorizeRoles('admin'), userController.getAll);

router.put('/:id', authenticate, authorizeRoles('admin'), userController.update);

router.delete('/:id', authenticate, authorizeRoles('admin'), userController.deactivate);

export default router;