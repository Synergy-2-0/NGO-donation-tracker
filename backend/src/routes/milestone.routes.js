import express from 'express';
import * as ctrl from '../controllers/milestone.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
	createMilestoneSchema,
	milestoneQuerySchema,
	updateMilestoneSchema,
} from '../validators/milestone.validator.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'ngo-admin'), validateRequest(createMilestoneSchema), ctrl.createMilestone);
router.get('/', authenticate, validateRequest(milestoneQuerySchema, 'query'), ctrl.getMilestones);
router.get('/:id', authenticate, ctrl.getMilestone);
router.put('/:id', authenticate, authorizeRoles('admin', 'ngo-admin'), validateRequest(updateMilestoneSchema), ctrl.updateMilestone);
router.delete('/:id', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.deleteMilestone);

export default router;
