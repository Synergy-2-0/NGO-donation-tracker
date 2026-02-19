import express from "express";
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

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Campaign
 *     description: Campaign management endpoints
 *   - name: Campaign progress log
 *     description: Campaign progress log management endpoints
 */


/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               goalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Campaign created successfully
 */
router.post("/", createCampaign);

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: List of campaigns
 */
router.get("/", getCampaigns);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign details
 */
router.get("/:id", getCampaignById);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     summary: Update campaign
 *     tags: [Campaign]
 */
router.put("/:id", updateCampaign);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   delete:
 *     summary: Soft delete campaign
 *     tags: [Campaign]
 */
router.delete("/:id", deleteCampaign);



/**
 * @swagger
 * /api/campaigns/{id}/publish:
 *   put:
 *     summary: Publish a draft campaign
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign status updated to active
 */
router.put("/:id/publish", publishCampaign);


/** ----------------- progress log  routes ----------------- */

/**
 * @swagger
 * /api/campaigns/{id}/progress:
 *   post:
 *     summary: Add progress log to campaign
 *     tags: [Campaign progress log]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amountRaised:
 *                 type: number
 *               beneficiaries:
 *                 type: number
 *               description:
 *                 type: string
 *               evidence:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Progress log created successfully
 */
router.post("/:id/progress", createProgress);

/**
 * @swagger
 * /api/campaigns/{id}/progress:
 *   get:
 *     summary: Get all progress logs for a campaign
 *     tags: [Campaign progress log]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of progress logs
 */
router.get("/:id/progress", getCampaignProgress);

/**
 * @swagger
 * /api/campaigns/{id}/progress/{progressId}:
 *   put:
 *     summary: Update a progress log
 *     tags: [Campaign progress log]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: progressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amountRaised:
 *                 type: number
 *               beneficiaries:
 *                 type: number
 *               description:
 *                 type: string
 *               evidence:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Progress log updated successfully
 */
router.put("/:id/progress/:progressId", updateProgress);

/**
 * @swagger
 * /api/campaigns/{id}/progress/{progressId}:
 *   delete:
 *     summary: Delete a progress log
 *     tags: [Campaign progress log]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: progressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress log deleted successfully
 */
router.delete("/:id/progress/:progressId", deleteProgress);

/** ----------------- report routes ----------------- */


/**
 * @swagger
 * /api/campaigns/{id}/report:
 *   post:
 *     summary: Create a final report for a completed campaign
 *     tags: [Campaign Report]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *                 description: Overview of campaign results
 *               totalRaised:
 *                 type: number
 *                 description: Total amount raised by the campaign
 *               beneficiaries:
 *                 type: number
 *                 description: Total number of beneficiaries reached
 *               evidence:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs or paths to evidence (images, documents)
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Bad request / validation error
 *       404:
 *         description: Campaign not found or not completed
 */
router.post("/:id/report", createReport);

/**
 * @swagger
 * /api/campaigns/{id}/report:
 *   get:
 *     summary: Get the report for a specific campaign
 *     tags: [Campaign Report]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign report details
 *       404:
 *         description: Report not found
 */
router.get("/:id/report", getReportByCampaign);

/**
 * @swagger
 * /api/campaigns/report/{reportId}:
 *   get:
 *     summary: Get a report by its ID
 *     tags: [Campaign Report]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found
 */
router.get("/report/:reportId", getReportById);

router.get("/:id/metrics", getCampaignMetrics);


/** ----------------- metrics route ----------------- */

/**
 * @swagger
 * /api/campaigns/{id}/metrics:
 *   get:
 *     summary: Get impact metrics for a specific campaign
 *     tags: [Campaign Metrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign metrics details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRaised:
 *                   type: number
 *                   description: Total amount raised for the campaign
 *                 goalAmount:
 *                   type: number
 *                   description: Campaign's goal amount
 *                 totalBeneficiaries:
 *                   type: number
 *                   description: Total beneficiaries impacted
 *                 progressCount:
 *                   type: number
 *                   description: Number of progress logs recorded
 *                 completionRate:
 *                   type: number
 *                   description: Campaign completion rate as a percentage
 *       400:
 *         description: Bad request or campaign not found
 */
export default router;
