import express from "express";
import upload from "../middlewares/upload.middleware.js";
import {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    publishCampaign,
    getCampaignMetrics
} from "../controllers/campaign.controller.js";

import {
    createProgress,
    getCampaignProgress,
    updateProgress,
    deleteProgress
} from "../controllers/progress.controller.js";

import {
    createReport,
    getReportByCampaign,
    getReportById
} from "../controllers/campaignReport.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Campaign CRUD
router.post("/", authenticate, authorizeRoles("admin", "ngo-admin"), createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.put("/:id", authenticate, authorizeRoles("admin", "ngo-admin"), updateCampaign);
router.delete("/:id", authenticate, authorizeRoles("admin", "ngo-admin"), deleteCampaign);
router.put("/:id/publish", authenticate, authorizeRoles("admin", "ngo-admin"), publishCampaign);

// progress log routes
router.post("/:id/progress", authenticate, authorizeRoles("admin", "ngo-admin"), upload.array("evidence", 5), createProgress);
router.get("/:id/progress", getCampaignProgress);
router.put("/:id/progress/:progressId", authenticate, authorizeRoles("admin", "ngo-admin"), upload.array("evidence", 5), updateProgress);
router.delete("/:id/progress/:progressId", authenticate, authorizeRoles("admin", "ngo-admin"), deleteProgress);

// report routes
router.post("/:id/report", authenticate, authorizeRoles("admin", "ngo-admin"), upload.array("evidence", 5), createReport);
router.get("/:id/report", getReportByCampaign);
router.get("/report/:reportId", getReportById);

// metrics route
router.get("/:id/metrics", getCampaignMetrics);

export default router;
