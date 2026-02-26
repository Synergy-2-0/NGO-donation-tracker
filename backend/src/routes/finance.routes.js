import express from "express";
import * as transactionController from "../controllers/transaction.controller.js";
import * as fundAllocationController from "../controllers/fundAllocation.controller.js";
import * as auditLogController from "../controllers/auditLog.controller.js";
import * as payHereController from "../controllers/payhere.controller.js";
import * as trustScoreController from "../controllers/trustScore.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import {
    validate,
    createTransactionSchema,
    updateTransactionSchema,
    createAllocationSchema,
    updateAllocationSchema,
    payHereInitSchema,
} from "../validators/finance.validator.js";

const router = express.Router();

// ==================== PayHere Routes ====================
/**
 * @swagger
 * /api/finance/payhere/init:
 *   post:
 *     summary: Initialize PayHere payment
 *     tags: [Finance - PayHere]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - donorId
 *               - ngoId
 *               - amount
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *             properties:
 *               donorId:
 *                 type: string
 *               ngoId:
 *                 type: string
 *               campaignId:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 default: LKR
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 */
router.post("/payhere/init", validate(payHereInitSchema), payHereController.initPayment);

/**
 * @swagger
 * /api/finance/payhere/callback:
 *   post:
 *     summary: Handle PayHere payment callback (webhook)
 *     tags: [Finance - PayHere]
 *     responses:
 *       200:
 *         description: Callback processed successfully
 */
router.post("/payhere/callback", payHereController.handleCallback);

/**
 * @swagger
 * /api/finance/payhere/config:
 *   get:
 *     summary: Get PayHere configuration
 *     tags: [Finance - PayHere]
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 */
router.get("/payhere/config", payHereController.getConfig);

// ==================== Transaction Routes ====================
/**
 * @swagger
 * /api/finance/transactions:
 *   post:
 *     summary: Create a new transaction (system use)
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
router.post(
    "/transactions",
    protect,
    restrictTo("system", "admin"),
    validate(createTransactionSchema),
    transactionController.createTransaction
);

/**
 * @swagger
 * /api/finance/transactions:
 *   get:
 *     summary: Get all transactions (admin only)
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 */
router.get(
    "/transactions",
    protect,
    restrictTo("admin"),
    transactionController.getAllTransactions
);

/**
 * @swagger
 * /api/finance/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 */
router.get(
    "/transactions/:id",
    protect,
    transactionController.getTransactionById
);

/**
 * @swagger
 * /api/finance/transactions/ngo/{id}:
 *   get:
 *     summary: Get transactions by NGO ID
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions for NGO
 */
router.get(
    "/transactions/ngo/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    transactionController.getTransactionsByNgoId
);

/**
 * @swagger
 * /api/finance/transactions/donor/{id}:
 *   get:
 *     summary: Get transactions by donor ID
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions for donor
 */
router.get(
    "/transactions/donor/:id",
    protect,
    transactionController.getTransactionsByDonorId
);

/**
 * @swagger
 * /api/finance/transactions/campaign/{id}:
 *   get:
 *     summary: Get transactions by campaign ID
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions for campaign
 */
router.get(
    "/transactions/campaign/:id",
    protect,
    transactionController.getTransactionsByCampaignId
);

/**
 * @swagger
 * /api/finance/transactions/{id}:
 *   put:
 *     summary: Update transaction (ngo-admin)
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 */
router.put(
    "/transactions/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    validate(updateTransactionSchema),
    transactionController.updateTransaction
);

/**
 * @swagger
 * /api/finance/transactions/{id}:
 *   delete:
 *     summary: Archive transaction (admin only)
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction archived successfully
 */
router.delete(
    "/transactions/:id",
    protect,
    restrictTo("admin"),
    transactionController.archiveTransaction
);

/**
 * @swagger
 * /api/finance/summary/ngo/{id}:
 *   get:
 *     summary: Get financial summary by NGO
 *     tags: [Finance - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Financial summary
 */
router.get(
    "/summary/ngo/:id",
    protect,
    transactionController.getFinancialSummary
);

// ==================== Fund Allocation Routes ====================
/**
 * @swagger
 * /api/finance/allocations:
 *   post:
 *     summary: Create fund allocation (ngo-admin)
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Allocation created successfully
 */
router.post(
    "/allocations",
    protect,
    restrictTo("ngo-admin", "admin"),
    validate(createAllocationSchema),
    fundAllocationController.createAllocation
);

/**
 * @swagger
 * /api/finance/allocations:
 *   get:
 *     summary: Get all fund allocations (admin only)
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all allocations
 */
router.get(
    "/allocations",
    protect,
    restrictTo("admin"),
    fundAllocationController.getAllAllocations
);

/**
 * @swagger
 * /api/finance/allocations/{id}:
 *   get:
 *     summary: Get allocation by ID
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Allocation details
 */
router.get(
    "/allocations/:id",
    protect,
    fundAllocationController.getAllocationById
);

/**
 * @swagger
 * /api/finance/allocations/ngo/{id}:
 *   get:
 *     summary: Get allocations by NGO ID
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of allocations for NGO
 */
router.get(
    "/allocations/ngo/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    fundAllocationController.getAllocationsByNgoId
);

/**
 * @swagger
 * /api/finance/allocations/transaction/{id}:
 *   get:
 *     summary: Get allocations by transaction ID
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of allocations for transaction
 */
router.get(
    "/allocations/transaction/:id",
    protect,
    fundAllocationController.getAllocationsByTransactionId
);

/**
 * @swagger
 * /api/finance/allocations/category/ngo/{id}:
 *   get:
 *     summary: Get allocations by category for NGO
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Allocations grouped by category
 */
router.get(
    "/allocations/category/ngo/:id",
    protect,
    fundAllocationController.getAllocationsByCategory
);

/**
 * @swagger
 * /api/finance/allocations/{id}:
 *   put:
 *     summary: Update fund allocation (ngo-admin)
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Allocation updated successfully
 */
router.put(
    "/allocations/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    validate(updateAllocationSchema),
    fundAllocationController.updateAllocation
);

/**
 * @swagger
 * /api/finance/allocations/{id}:
 *   delete:
 *     summary: Delete fund allocation (admin only)
 *     tags: [Finance - Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Allocation deleted successfully
 */
router.delete(
    "/allocations/:id",
    protect,
    restrictTo("admin"),
    fundAllocationController.deleteAllocation
);

// ==================== Trust Score Routes ====================
/**
 * @swagger
 * /api/finance/trust-score/{ngoId}:
 *   get:
 *     summary: Get trust score for an NGO
 *     tags: [Finance - Trust Score]
 *     parameters:
 *       - in: path
 *         name: ngoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trust score calculated successfully
 */
router.get("/trust-score/:ngoId", trustScoreController.getTrustScore);

/**
 * @swagger
 * /api/finance/transparency-report/{ngoId}:
 *   get:
 *     summary: Get transparency report for an NGO
 *     tags: [Finance - Trust Score]
 *     parameters:
 *       - in: path
 *         name: ngoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transparency report generated
 */
router.get(
    "/transparency-report/:ngoId",
    trustScoreController.getTransparencyReport
);

/**
 * @swagger
 * /api/finance/trust-score/compare:
 *   post:
 *     summary: Compare trust scores across multiple NGOs
 *     tags: [Finance - Trust Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ngoIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Trust scores compared successfully
 */
router.post("/trust-score/compare", trustScoreController.compareTrustScores);

// ==================== Audit Log Routes ====================
/**
 * @swagger
 * /api/finance/audits:
 *   get:
 *     summary: Get all audit logs (admin only)
 *     tags: [Finance - Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: List of audit logs
 */
router.get(
    "/audits",
    protect,
    restrictTo("admin"),
    auditLogController.getAllAuditLogs
);

/**
 * @swagger
 * /api/finance/audits/{id}:
 *   get:
 *     summary: Get audit log by ID
 *     tags: [Finance - Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit log details
 */
router.get(
    "/audits/:id",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogById
);

/**
 * @swagger
 * /api/finance/audits/entity/{id}:
 *   get:
 *     summary: Get audit logs by entity ID
 *     tags: [Finance - Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of audit logs for entity
 */
router.get(
    "/audits/entity/:id",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByEntityId
);

/**
 * @swagger
 * /api/finance/audits/type/{type}:
 *   get:
 *     summary: Get audit logs by entity type
 *     tags: [Finance - Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of audit logs for entity type
 */
router.get(
    "/audits/type/:type",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByEntityType
);

/**
 * @swagger
 * /api/finance/audits/user/{id}:
 *   get:
 *     summary: Get audit logs by user ID
 *     tags: [Finance - Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of audit logs for user
 */
router.get(
    "/audits/user/:id",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByUserId
);

/**
 * @swagger
 * /api/finance/audits/date-range:
 *   get:
 *     summary: Get audit logs by date range
 *     tags: [Finance - Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of audit logs in date range
 */
router.get(
    "/audits/date-range",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByDateRange
);

/**
 * @swagger
 * /api/finance/audits/{id}:
 *   delete:
 *     summary: Delete audit log (admin only)
 *     tags: [Finance - Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit log deleted successfully
 */
router.delete(
    "/audits/:id",
    protect,
    restrictTo("admin"),
    auditLogController.deleteAuditLog
);

export default router;
