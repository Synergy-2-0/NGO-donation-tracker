import express from 'express';
import * as ctrl from '../controllers/agreement.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
	createAgreementSchema,
	updateAgreementSchema,
	updateAgreementStatusSchema,
} from '../validators/agreement.validator.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'ngo-admin', 'partner'), validateRequest(createAgreementSchema), ctrl.createAgreement);
router.get('/', authenticate, ctrl.getAgreements);
router.get('/partner/:partnerId', authenticate, ctrl.getPartnerAgreements);
router.get('/campaign/:campaignId', authenticate, ctrl.getAgreementsByCampaign);
router.get('/:id', authenticate, ctrl.getAgreement);
router.put('/:id', authenticate, validateRequest(updateAgreementSchema), ctrl.updateAgreement);
router.patch('/:id/status', authenticate, validateRequest(updateAgreementStatusSchema), ctrl.updateAgreementStatus);
router.patch('/:id/approve', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.approveAgreement);
router.patch('/:id/accept', authenticate, authorizeRoles('partner'), ctrl.acceptAgreement);
router.delete('/:id', authenticate, ctrl.deleteAgreement);

export default router;
