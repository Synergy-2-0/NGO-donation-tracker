import express from 'express';
import * as ctrl from '../controllers/transparency.controller.js';

const router = express.Router();

// Public endpoints — no authentication required
router.get('/partnerships', ctrl.getPublicPartnerships);
router.get('/agreements/:partnerId', ctrl.getPartnerPublicAgreements);
router.get('/impact-metrics', ctrl.getImpactMetrics);
router.get('/donor-stats', ctrl.getPublicDonorStats);
router.get('/map-data', ctrl.getMapData);
router.get('/campaign-partners/:campaignId', ctrl.getCampaignPublicPartners);

export default router;
