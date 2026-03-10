import express from 'express';
import * as ctrl from '../controllers/agreement.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'partner'), ctrl.createAgreement);
router.get('/', authenticate, ctrl.getAgreements);
router.get('/partner/:partnerId', authenticate, ctrl.getPartnerAgreements);
router.get('/campaign/:campaignId', authenticate, ctrl.getAgreementsByCampaign);
router.get('/:id', authenticate, ctrl.getAgreement);
router.put('/:id', authenticate, ctrl.updateAgreement);
router.patch('/:id/status', authenticate, ctrl.updateAgreementStatus);
router.delete('/:id', authenticate, ctrl.deleteAgreement);

export default router;
