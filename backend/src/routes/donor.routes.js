import express from 'express';
import * as ctrl from '../controllers/donor.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

// Donor Profile
router.post('/', authenticate, authorizeRoles('donor'), ctrl.createDonor);
router.get('/', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.getAllDonors);
router.get('/me', authenticate, authorizeRoles('donor'), ctrl.getMyDonorProfile);
router.get('/analytics/segments', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.getSegmentAnalytics);
router.get('/:id', authenticate, ctrl.getDonorById);
router.put('/:id', authenticate, ctrl.updateDonor);
router.delete('/:id', authenticate, authorizeRoles('admin'), ctrl.deleteDonor);

// Pledges
router.post('/:id/pledges', authenticate, ctrl.createPledge);
router.put('/:id/pledges/:pledgeId', authenticate, ctrl.updatePledge);
router.delete('/:id/pledges/:pledgeId', authenticate, ctrl.deletePledge);

// Interactions
router.post('/:id/interactions', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.createInteraction);
router.delete('/:id/interactions/:interactionId', authenticate, authorizeRoles('admin'), ctrl.deleteInteraction);

// Analytics
router.get('/:id/analytics', authenticate, ctrl.getDonorAnalytics);
router.patch('/:id/analytics/recalculate', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.recalculateAnalytics);

export default router;