import express from 'express';
import * as ctrl from '../controllers/milestone.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, ctrl.createMilestone);
router.get('/', authenticate, ctrl.getMilestones);
router.get('/:id', authenticate, ctrl.getMilestone);
router.put('/:id', authenticate, ctrl.updateMilestone);
router.delete('/:id', authenticate, ctrl.deleteMilestone);

export default router;
