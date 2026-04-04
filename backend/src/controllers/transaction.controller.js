import * as transactionService from "../services/transaction.service.js";
import * as ngoService from "../services/ngo.service.js";

// Helper to enforce NGO isolation Hub
const getAuthorizedNgoId = async (req) => {
    if (req.user.role === 'admin') return req.params.id;
    if (req.user.role === 'ngo-admin') {
        const ngo = await ngoService.getNGOProfile(req.user.id);
        if (!ngo) throw new Error('NGO profile not found Hub');
        return ngo._id.toString();
    }
    throw new Error('Unauthorized operational access Hub');
};

// Create transaction (system use only)
export const createTransaction = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const transaction = await transactionService.createTransaction(
            req.body,
            userId
        );
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all transactions (admin only)
export const getAllTransactions = async (req, res) => {
    try {
        const { orderId } = req.query;
        if (orderId) {
            const transaction = await transactionService.getTransactionByOrderId(orderId);
            return res.json(transaction);
        }
        const transactions = await transactionService.getAllTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single transaction
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await transactionService.getTransactionById(
            req.params.id
        );
        res.json(transaction);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get transactions by NGO ID (ngo-admin)
export const getTransactionsByNgoId = async (req, res) => {
    try {
        const ngoId = await getAuthorizedNgoId(req);
        const transactions = await transactionService.getTransactionsByNgoId(ngoId);
        res.json(transactions);
    } catch (error) {
        res.status(error.message === 'NGO profile not found Hub' ? 404 : 403).json({ message: error.message });
    }
};

// Get transactions by donor ID
export const getTransactionsByDonorId = async (req, res) => {
    try {
        const transactions = await transactionService.getTransactionsByDonorId(
            req.params.id
        );
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transactions by campaign ID
export const getTransactionsByCampaignId = async (req, res) => {
    try {
        const transactions = await transactionService.getTransactionsByCampaignId(
            req.params.id
        );
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update transaction (ngo-admin)
export const updateTransaction = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const transaction = await transactionService.updateTransaction(
            req.params.id,
            req.body,
            userId
        );
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Archive transaction (admin)
export const archiveTransaction = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const transaction = await transactionService.archiveTransaction(
            req.params.id,
            userId
        );
        res.json({ message: "Transaction archived successfully", transaction });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get financial summary by NGO
export const getFinancialSummary = async (req, res) => {
    try {
        const ngoId = await getAuthorizedNgoId(req);
        const summary = await transactionService.getFinancialSummary(ngoId);
        res.json(summary);
    } catch (error) {
        res.status(error.message === 'NGO profile not found Hub' ? 404 : 403).json({ message: error.message });
    }
};
