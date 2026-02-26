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

// Create campaign (draft by default)
router.post(
    "/",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    createCampaign
);

// Get all campaigns 
router.get("/", getCampaigns);

// Get single campaign
router.get("/:id", getCampaignById);

// Update campaign
router.put(
    "/:id",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    updateCampaign
);

// Soft delete (archive)
router.delete(
    "/:id",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    deleteCampaign
);

// Publish campaign 
router.put(
    "/:id/publish",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    publishCampaign
);

// Add progress log with evidence images
router.post(
    "/:id/progress",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    upload.array("evidence", 5),
    createProgress
);

// Get all progress logs for campaign
router.get("/:id/progress", getCampaignProgress);

// Update progress log
router.put(
    "/:id/progress/:progressId",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    upload.array("evidence", 5),
    updateProgress
);

// Delete progress log
router.delete(
    "/:id/progress/:progressId",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    deleteProgress
);

// Create final campaign report
router.post(
    "/:id/report",
    authenticate,
    authorizeRoles("admin", "ngo-admin"),
    upload.array("evidence", 5),
    createReport
);

// Get report by campaign ID
router.get("/:id/report", getReportByCampaign);

// Get report by report ID
router.get("/report/:reportId", getReportById);

// Get impact metrics
router.get("/:id/metrics", getCampaignMetrics);

export default router;