import express from 'express';
import * as ngoFinanceController from '../controllers/ngoFinance.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('ngo-admin'));

router.get('/ledger', ngoFinanceController.getLedger);
router.post('/allocate', ngoFinanceController.allocate);
router.get('/metrics', ngoFinanceController.getMetrics);

export default router;
