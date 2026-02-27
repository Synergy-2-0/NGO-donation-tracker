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

/* --- campaign --- */
// Create campaign (draft by default)
router.post("/", authenticate, authorizeRoles("admin", "ngo-admin"), createCampaign);

// Get all campaigns 
router.get("/", getCampaigns);

// Get campaign by ID
router.get("/:id", getCampaignById);

// Update campaign (only if it's a draft)
router.put("/:id", authenticate, authorizeRoles("admin", "ngo-admin"), updateCampaign);

// Delete campaign 
router.delete("/:id", authenticate, authorizeRoles("admin", "ngo-admin"), deleteCampaign);

// Publish campaign 
router.put("/:id/publish", authenticate, authorizeRoles("admin", "ngo-admin"), publishCampaign);

/* --- progress log routes --- */
// Create progress log for a campaign with evidence images
router.post("/:id/progress", authenticate, authorizeRoles("admin", "ngo-admin"), upload.array("evidence", 5), createProgress);

// Get all progress logs for a campaign
router.get("/:id/progress", getCampaignProgress);

// Update progress log 
router.put("/:id/progress/:progressId", authenticate, authorizeRoles("admin", "ngo-admin"), upload.array("evidence", 5), updateProgress);

// Delete progress log
router.delete("/:id/progress/:progressId", authenticate, authorizeRoles("admin", "ngo-admin"), deleteProgress);

/* --- report routes --- */
// Create final campaign report 
router.post("/:id/report", authenticate, authorizeRoles("admin", "ngo-admin"), upload.array("evidence", 5), createReport);

// Get final report for a campaign
router.get("/:id/report", getReportByCampaign);

// Get report by ID
router.get("/report/:reportId", getReportById);

// metrics route
router.get("/:id/metrics", getCampaignMetrics);

export default router;
