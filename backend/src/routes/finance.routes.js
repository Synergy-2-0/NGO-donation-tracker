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

// PayHere Routes
router.post("/payhere/init", validate(payHereInitSchema), payHereController.initPayment);

router.post("/payhere/callback", payHereController.handleCallback);

router.get("/payhere/config", payHereController.getConfig);

router.post("/payhere/verify/:transactionId", protect, payHereController.verifyPaymentSuccess);

// ==================== Transaction Routes ====================
router.post(
    "/transactions",
    protect,
    restrictTo("system", "admin"),
    validate(createTransactionSchema),
    transactionController.createTransaction
);

router.get(
    "/transactions",
    protect,
    restrictTo("admin"),
    transactionController.getAllTransactions
);

router.get(
    "/transactions/:id",
    protect,
    transactionController.getTransactionById
);

router.get(
    "/transactions/ngo/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    transactionController.getTransactionsByNgoId
);

router.get(
    "/transactions/donor/:id",
    protect,
    transactionController.getTransactionsByDonorId
);

router.get(
    "/transactions/campaign/:id",
    protect,
    transactionController.getTransactionsByCampaignId
);

router.put(
    "/transactions/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    validate(updateTransactionSchema),
    transactionController.updateTransaction
);

router.delete(
    "/transactions/:id",
    protect,
    restrictTo("admin"),
    transactionController.archiveTransaction
);

router.get(
    "/summary/ngo/:id",
    protect,
    transactionController.getFinancialSummary
);

// ==================== Fund Allocation Routes ====================
router.post(
    "/allocations",
    protect,
    restrictTo("ngo-admin", "admin"),
    validate(createAllocationSchema),
    fundAllocationController.createAllocation
);

router.get(
    "/allocations",
    protect,
    restrictTo("admin"),
    fundAllocationController.getAllAllocations
);

router.get(
    "/allocations/:id",
    protect,
    fundAllocationController.getAllocationById
);

router.get(
    "/allocations/ngo/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    fundAllocationController.getAllocationsByNgoId
);

router.get(
    "/allocations/transaction/:id",
    protect,
    fundAllocationController.getAllocationsByTransactionId
);

router.get(
    "/allocations/category/ngo/:id",
    protect,
    fundAllocationController.getAllocationsByCategory
);

router.put(
    "/allocations/:id",
    protect,
    restrictTo("ngo-admin", "admin"),
    validate(updateAllocationSchema),
    fundAllocationController.updateAllocation
);

router.delete(
    "/allocations/:id",
    protect,
    restrictTo("admin"),
    fundAllocationController.deleteAllocation
);

// ==================== Trust Score Routes ====================
router.get("/trust-score/:ngoId", trustScoreController.getTrustScore);

router.get(
    "/transparency-report/:ngoId",
    trustScoreController.getTransparencyReport
);


router.post("/trust-score/compare", trustScoreController.compareTrustScores);

// ==================== Audit Log Routes ====================
router.get(
    "/audits",
    protect,
    restrictTo("admin"),
    auditLogController.getAllAuditLogs
);


router.get(
    "/audits/:id",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogById
);

router.get(
    "/audits/entity/:id",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByEntityId
);

router.get(
    "/audits/type/:type",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByEntityType
);

router.get(
    "/audits/user/:id",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByUserId
);

router.get(
    "/audits/date-range",
    protect,
    restrictTo("admin"),
    auditLogController.getAuditLogsByDateRange
);

router.delete(
    "/audits/:id",
    protect,
    restrictTo("admin"),
    auditLogController.deleteAuditLog
);

export default router;
