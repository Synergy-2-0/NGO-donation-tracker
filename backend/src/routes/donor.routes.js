import express from 'express';
import * as ctrl from '../controllers/donor.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Donors
 *   description: Donor management and engagement endpoints
 */

// ── Donor Profile ──────────────────────────────────────────────

/**
 * @swagger
 * /api/donors:
 *   post:
 *     summary: Create a donor profile (donor registers their details)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               address:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   country: { type: string }
 *               preferredCommunication: { type: string, enum: [email, phone, sms] }
 *               gdprConsent:
 *                 type: object
 *                 properties:
 *                   given: { type: boolean }
 *                   version: { type: string }
 *     responses:
 *       201:
 *         description: Donor profile created
 *       400:
 *         description: Validation error or profile already exists
 */
router.post('/', authenticate, authorizeRoles('donor'), ctrl.createDonor);

/**
 * @swagger
 * /api/donors:
 *   get:
 *     summary: Get all donors (admin only)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: segment
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of donors
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.getAllDonors);

/**
 * @swagger
 * /api/donors/me:
 *   get:
 *     summary: Get own donor profile (donor)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Own donor profile
 *       404:
 *         description: Profile not found
 */
router.get('/me', authenticate, authorizeRoles('donor'), ctrl.getMyDonorProfile);

/**
 * @swagger
 * /api/donors/analytics/segments:
 *   get:
 *     summary: Get donor segment analytics (admin only)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Segment stats
 */
router.get('/analytics/segments', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.getSegmentAnalytics);

/**
 * @swagger
 * /api/donors/{id}:
 *   get:
 *     summary: Get donor by ID (admin or own profile)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Donor details
 *       404:
 *         description: Donor not found
 */
router.get('/:id', authenticate, ctrl.getDonorById);

/**
 * @swagger
 * /api/donors/{id}:
 *   put:
 *     summary: Update donor details (admin or own)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated donor
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticate, ctrl.updateDonor);

/**
 * @swagger
 * /api/donors/{id}:
 *   delete:
 *     summary: Soft delete donor (GDPR) – admin only
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Donor soft deleted
 */
router.delete('/:id', authenticate, authorizeRoles('admin'), ctrl.deleteDonor);

// ── Pledges ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/donors/{id}/pledges:
 *   post:
 *     summary: Create a pledge for a donor
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number }
 *               frequency: { type: string, enum: [one-time, monthly, quarterly, annually] }
 *               campaign: { type: string }
 *     responses:
 *       201:
 *         description: Pledge created and email sent
 */
router.post('/:id/pledges', authenticate, ctrl.createPledge);

/**
 * @swagger
 * /api/donors/{id}/pledges/{pledgeId}:
 *   put:
 *     summary: Update a pledge
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: pledgeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pledge updated
 */
router.put('/:id/pledges/:pledgeId', authenticate, ctrl.updatePledge);

/**
 * @swagger
 * /api/donors/{id}/pledges/{pledgeId}:
 *   delete:
 *     summary: Delete a pledge
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: pledgeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pledge deleted
 */
router.delete('/:id/pledges/:pledgeId', authenticate, ctrl.deletePledge);

// ── Interactions ───────────────────────────────────────────────

/**
 * @swagger
 * /api/donors/{id}/interactions:
 *   post:
 *     summary: Log an interaction with a donor (admin/ngo-admin)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type: { type: string, enum: [email, call, meeting, event, other] }
 *               note: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Interaction logged
 */
router.post('/:id/interactions', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.createInteraction);

/**
 * @swagger
 * /api/donors/{id}/interactions/{interactionId}:
 *   delete:
 *     summary: Delete an interaction log (admin only)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: interactionId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Interaction deleted
 */
router.delete('/:id/interactions/:interactionId', authenticate, authorizeRoles('admin'), ctrl.deleteInteraction);

// ── Analytics ──────────────────────────────────────────────────

/**
 * @swagger
 * /api/donors/{id}/analytics:
 *   get:
 *     summary: Get analytics for a specific donor
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Donor analytics data
 */
router.get('/:id/analytics', authenticate, ctrl.getDonorAnalytics);

/**
 * @swagger
 * /api/donors/{id}/analytics/recalculate:
 *   patch:
 *     summary: Recalculate donor analytics (admin)
 *     tags: [Donors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Analytics recalculated
 */
router.patch('/:id/analytics/recalculate', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.recalculateAnalytics);

export default router;