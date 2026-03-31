import * as transactionRepository from "../repository/transaction.repository.js";
import * as fundAllocationRepository from "../repository/fundAllocation.repository.js";
import mongoose from "mongoose";

/**
 * Calculate trust score for an NGO
 * Trust Score = (Allocated Funds / Total Received Funds) * 100
 */
export const calculateTrustScore = async (ngoId) => {
    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        throw new Error("Invalid NGO ID");
    }

    const ngoObjectId = new mongoose.Types.ObjectId(ngoId);

    // Get total received funds (completed transactions only)
    const financialSummary = await transactionRepository.getFinancialSummaryByNgo(
        ngoObjectId
    );

    const totalReceived =
        financialSummary.length > 0 ? financialSummary[0].totalReceived : 0;

    if (totalReceived === 0) {
        return {
            ngoId,
            totalReceived: 0,
            totalAllocated: 0,
            unallocatedFunds: 0,
            trustScore: 0,
            rating: "No Data",
            message: "No completed transactions found",
        };
    }

    // Get total allocated funds
    const allocationSummary = await fundAllocationRepository.getTotalAllocatedByNgo(
        ngoObjectId
    );

    const totalAllocated =
        allocationSummary.length > 0 ? allocationSummary[0].totalAllocated : 0;

    // Calculate trust score
    const trustScore = (totalAllocated / totalReceived) * 100;

    // Calculate unallocated funds
    const unallocatedFunds = totalReceived - totalAllocated;

    // Determine rating
    let rating = "";
    if (trustScore >= 90) {
        rating = "Excellent";
    } else if (trustScore >= 75) {
        rating = "Very Good";
    } else if (trustScore >= 60) {
        rating = "Good";
    } else if (trustScore >= 40) {
        rating = "Fair";
    } else {
        rating = "Poor";
    }

    return {
        ngoId,
        totalReceived: parseFloat(totalReceived.toFixed(2)),
        totalAllocated: parseFloat(totalAllocated.toFixed(2)),
        unallocatedFunds: parseFloat(unallocatedFunds.toFixed(2)),
        trustScore: parseFloat(trustScore.toFixed(2)),
        rating,
        allocationPercentage: parseFloat(trustScore.toFixed(2)),
    };
};

/**
 * Get detailed transparency report for an NGO
 */
export const getTransparencyReport = async (ngoId) => {
    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        throw new Error("Invalid NGO ID");
    }

    const ngoObjectId = new mongoose.Types.ObjectId(ngoId);

    // Get trust score
    const trustScore = await calculateTrustScore(ngoId);

    // Get allocation by category
    const allocationsByCategory = await fundAllocationRepository.getAllocationsByCategory(
        ngoObjectId
    );

    // Get recent transactions
    const recentTransactions = await transactionRepository.findByNgoId(ngoObjectId);

    // Get recent allocations
    const recentAllocations = await fundAllocationRepository.findByNgoId(
        ngoObjectId
    );

    return {
        trustScore,
        allocationsByCategory,
        recentTransactions: recentTransactions.slice(0, 10),
        recentAllocations: recentAllocations.slice(0, 10),
        generatedAt: new Date(),
    };
};

/**
 * Compare trust scores across multiple NGOs
 */
export const compareTrustScores = async (ngoIds) => {
    if (!Array.isArray(ngoIds) || ngoIds.length === 0) {
        throw new Error("NGO IDs must be a non-empty array");
    }

    const scores = await Promise.all(
        ngoIds.map(async (ngoId) => {
            try {
                return await calculateTrustScore(ngoId);
            } catch (error) {
                return {
                    ngoId,
                    error: error.message,
                };
            }
        })
    );

    // Sort by trust score descending
    const validScores = scores.filter((s) => !s.error);
    validScores.sort((a, b) => b.trustScore - a.trustScore);

    return {
        comparison: validScores,
        totalNGOs: ngoIds.length,
        validScores: validScores.length,
    };
};
/**
 * Recalculate trust score (wrapper for external services)
 */
export const recalculateTrustScore = async (ngoId) => {
    return await calculateTrustScore(ngoId);
};
