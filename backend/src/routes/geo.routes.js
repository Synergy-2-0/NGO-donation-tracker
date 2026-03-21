import express from 'express';
import * as ctrl from '../controllers/geo.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { geoPartnersQuerySchema } from '../validators/geo.validator.js';

const router = express.Router();

// Public endpoints — no authentication required
router.get('/partners', validateRequest(geoPartnersQuerySchema, 'query'), ctrl.getPartnersGeo);
router.get('/heatmap', ctrl.getHeatmap);
router.get('/impact-zones', ctrl.getImpactZones);

export default router;
