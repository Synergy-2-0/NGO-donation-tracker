import express from 'express';
import * as ctrl from '../controllers/partners.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Partner management endpoints
 */

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Create a new partner profile (pending approval)
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [organizationName, organizationType, industry, contactPerson, address, csrFocus]
 *             properties:
 *               organizationName: { type: string }
 *               # ... add more as needed
 *     responses:
 *       201:
 *         description: Partner created (pending)
 *       401:
 *         description: Unauthorized
 */

router.post('/', authenticate, authorizeRoles('partner'), ctrl.createPartnership);

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: "List partners (admin: all, others: public approved only)"
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of partners
 */
router.get('/', authenticate, ctrl.getPartners);

router.get('/:id', authenticate, ctrl.getPartner);
router.put('/:id', authenticate, ctrl.updatePartner);
router.patch('/:id/approve', authenticate, authorizeRoles('admin'), ctrl.approvePartner);
router.delete('/:id', authenticate, authorizeRoles('admin'), ctrl.deletePartner);

export default router;