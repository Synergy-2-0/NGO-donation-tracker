import express from 'express';
import * as ctrl from '../controllers/agreement.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'partner'), ctrl.createAgreement);
router.get('/', authenticate, ctrl.getAgreements);
router.get('/:id', authenticate, ctrl.getAgreement);
router.put('/:id', authenticate, ctrl.updateAgreement);
router.delete('/:id', authenticate, ctrl.deleteAgreement);
router.get('/partner/:partnerId', authenticate, ctrl.getPartnerAgreements);

export default router;
