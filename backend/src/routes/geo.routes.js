import express from 'express';
import * as ctrl from '../controllers/geo.controller.js';

const router = express.Router();

// Public endpoints — no authentication required
router.get('/partners', ctrl.getPartnersGeo);
router.get('/heatmap', ctrl.getHeatmap);
router.get('/impact-zones', ctrl.getImpactZones);

export default router;
