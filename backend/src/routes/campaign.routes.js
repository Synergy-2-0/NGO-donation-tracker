import express from "express";
import {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    publishCampaign
} from "../controllers/campaign.controller.js";

import {
    createProgress,
    getCampaignProgress,
    updateProgress,
    deleteProgress
} from "../controllers/progress.controller.js";

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


export default router;
