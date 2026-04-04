import express from 'express';
import * as ctrl from '../controllers/ai.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Required auth for all AI endpoints
router.use(protect);

router.get('/donor-insights', 
  restrictTo('donor'), 
  ctrl.getDonorInsights
);

router.get('/partner-matches', 
  restrictTo('donor'), 
  ctrl.getPartnerMatches
);

router.get('/campaign-health/:id', 
  restrictTo('ngo-admin', 'admin'), 
  ctrl.analyzeCampaignHealth
);

router.get('/generate-summary/:id',
  restrictTo('ngo-admin', 'admin'),
  ctrl.generateCampaignSummary
);


export default router;
