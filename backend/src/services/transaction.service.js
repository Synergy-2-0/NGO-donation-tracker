import * as transactionRepository from "../repository/transaction.repository.js";
import * as auditLogRepository from "../repository/auditLog.repository.js";

export const createTransaction = async (data, userId = null) => {
    if (!data.donorId || !data.ngoId || !data.amount) {
        throw new Error("Donor ID, NGO ID, and amount are required");
    }

    const transaction = await transactionRepository.create(data);

    // Create audit log
    if (userId) {
        await auditLogRepository.create({
            entityType: "transaction",
            entityId: transaction._id,
            action: "create",
            changedBy: userId,
            newData: transaction,
        });
    }

    return transaction;
};

export const getAllTransactions = async () => {
    return await transactionRepository.findAll();
};

export const getTransactionById = async (id) => {
    const transaction = await transactionRepository.findById(id);

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    return transaction;
};

export const getTransactionsByNgoId = async (ngoId) => {
    return await transactionRepository.findByNgoId(ngoId);
};

export const getTransactionsByDonorId = async (donorId) => {
    return await transactionRepository.findByDonorId(donorId);
};

export const getTransactionsByCampaignId = async (campaignId) => {
    return await transactionRepository.findByCampaignId(campaignId);
};

export const updateTransaction = async (id, data, userId = null) => {
    const existingTransaction = await transactionRepository.findById(id);

    if (!existingTransaction) {
        throw new Error("Transaction not found");
    }

    const updatedTransaction = await transactionRepository.updateById(id, data);

    // Create audit log
    if (userId) {
        await auditLogRepository.create({
            entityType: "transaction",
            entityId: id,
            action: "update",
            changedBy: userId,
            previousData: existingTransaction,
            newData: updatedTransaction,
        });
    }

    return updatedTransaction;
};

export const archiveTransaction = async (id, userId = null) => {
    const existingTransaction = await transactionRepository.findById(id);

    if (!existingTransaction) {
        throw new Error("Transaction not found");
    }

    const archivedTransaction = await transactionRepository.archiveById(id);

    // Create audit log
    if (userId) {
        await auditLogRepository.create({
            entityType: "transaction",
            entityId: id,
            action: "archive",
            changedBy: userId,
            previousData: existingTransaction,
            newData: archivedTransaction,
        });
    }

    return archivedTransaction;
};

export const getFinancialSummary = async (ngoId) => {
    const summary = await transactionRepository.getFinancialSummaryByNgo(ngoId);
    return summary.length > 0 ? summary[0] : { totalReceived: 0, transactionCount: 0 };
};
