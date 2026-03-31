import * as fundAllocationRepository from "../repository/fundAllocation.repository.js";
import * as transactionRepository from "../repository/transaction.repository.js";
import * as auditLogRepository from "../repository/auditLog.repository.js";
import * as trustScoreService from "./trustScore.service.js";

export const createAllocation = async (data, userId = null) => {
    if (!data.transactionId || !data.ngoId || !data.amount || !data.category) {
        throw new Error(
            "Transaction ID, NGO ID, amount, and category are required"
        );
    }

    // Verify transaction exists
    const transaction = await transactionRepository.findById(data.transactionId);
    if (!transaction) {
        throw new Error("Transaction not found");
    }

    // Check if transaction is completed
    if (transaction.status !== "completed") {
        throw new Error("Can only allocate funds from completed transactions");
    }

    // Verify allocation doesn't exceed transaction amount
    const existingAllocations = await fundAllocationRepository.findByTransactionId(
        data.transactionId
    );

    const totalAllocated = existingAllocations.reduce(
        (sum, alloc) => sum + alloc.amount,
        0
    );

    if (totalAllocated + data.amount > transaction.amount) {
        throw new Error(
            `Allocation exceeds transaction amount. Available: ${
                transaction.amount - totalAllocated
            }, Requested: ${data.amount}`
        );
    }

    const allocation = await fundAllocationRepository.create(data);

    // Recalculate Trust Score for the NGO
    if (data.ngoId) {
        trustScoreService.recalculateTrustScore(data.ngoId).catch(() => {});
    }

    // Create audit log
    if (userId) {
        await auditLogRepository.create({
            entityType: "fundAllocation",
            entityId: allocation._id,
            action: "create",
            changedBy: userId,
            newData: allocation,
        });
    }

    return allocation;
};

export const getAllAllocations = async () => {
    return await fundAllocationRepository.findAll();
};

export const getAllocationById = async (id) => {
    const allocation = await fundAllocationRepository.findById(id);

    if (!allocation) {
        throw new Error("Fund allocation not found");
    }

    return allocation;
};

export const getAllocationsByNgoId = async (ngoId) => {
    return await fundAllocationRepository.findByNgoId(ngoId);
};

export const getAllocationsByTransactionId = async (transactionId) => {
    return await fundAllocationRepository.findByTransactionId(transactionId);
};

export const updateAllocation = async (id, data, userId = null) => {
    const existingAllocation = await fundAllocationRepository.findById(id);

    if (!existingAllocation) {
        throw new Error("Fund allocation not found");
    }

    // If amount is being updated, verify it doesn't exceed transaction amount
    if (data.amount && data.amount !== existingAllocation.amount) {
        const transaction = await transactionRepository.findById(
            existingAllocation.transactionId
        );

        const otherAllocations = await fundAllocationRepository.findByTransactionId(
            existingAllocation.transactionId
        );

        const otherAllocationsTotal = otherAllocations
            .filter((alloc) => alloc._id.toString() !== id)
            .reduce((sum, alloc) => sum + alloc.amount, 0);

        if (otherAllocationsTotal + data.amount > transaction.amount) {
            throw new Error(
                `Updated allocation exceeds transaction amount. Available: ${
                    transaction.amount - otherAllocationsTotal
                }, Requested: ${data.amount}`
            );
        }
    }

    const updatedAllocation = await fundAllocationRepository.updateById(id, data);

    // Create audit log
    if (userId) {
        await auditLogRepository.create({
            entityType: "fundAllocation",
            entityId: id,
            action: "update",
            changedBy: userId,
            previousData: existingAllocation,
            newData: updatedAllocation,
        });
    }

    return updatedAllocation;
};

export const deleteAllocation = async (id, userId = null) => {
    const existingAllocation = await fundAllocationRepository.findById(id);

    if (!existingAllocation) {
        throw new Error("Fund allocation not found");
    }

    const deletedAllocation = await fundAllocationRepository.softDelete(id);

    // Create audit log
    if (userId) {
        await auditLogRepository.create({
            entityType: "fundAllocation",
            entityId: id,
            action: "delete",
            changedBy: userId,
            previousData: existingAllocation,
        });
    }

    return deletedAllocation;
};

export const getAllocationsByCategory = async (ngoId) => {
    return await fundAllocationRepository.getAllocationsByCategory(ngoId);
};

export const getTotalAllocated = async (ngoId) => {
    const result = await fundAllocationRepository.getTotalAllocatedByNgo(ngoId);
    return result.length > 0 ? result[0].totalAllocated : 0;
};
