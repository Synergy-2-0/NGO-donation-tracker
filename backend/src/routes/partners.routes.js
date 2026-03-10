import express from 'express';
import * as ctrl from '../controllers/partners.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('partner'), ctrl.createPartnership);
router.get('/', authenticate, ctrl.getPartners);
router.get('/:id', authenticate, ctrl.getPartner);
router.put('/:id', authenticate, ctrl.updatePartner);
router.patch('/:id/approve', authenticate, authorizeRoles('admin'), ctrl.approvePartner);
router.delete('/:id', authenticate, ctrl.deletePartner);
router.get('/:id/impact', authenticate, ctrl.getPartnerImpact);

export default router;