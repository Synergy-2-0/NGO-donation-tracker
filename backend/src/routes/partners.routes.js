import express from 'express';
import * as ctrl from '../controllers/partners.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createPartnerSchema, updatePartnerSchema } from '../validators/partner.validator.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('partner'), validateRequest(createPartnerSchema), ctrl.createPartnership);
router.get('/', authenticate, ctrl.getPartners);
router.get('/:id/impact', authenticate, ctrl.getPartnerImpact);
router.get('/:id', authenticate, ctrl.getPartner);
router.put('/:id', authenticate, validateRequest(updatePartnerSchema), ctrl.updatePartner);
router.patch('/:id/approve', authenticate, authorizeRoles('admin'), ctrl.approvePartner);
router.delete('/:id', authenticate, ctrl.deletePartner);

export default router;