import * as transactionRepository from "../repository/transaction.repository.js";
import * as auditLogRepository from "../repository/auditLog.repository.js";
import * as campaignRepository from "../repository/campaign.repository.js";
import * as donorRepository from "../repository/donor.repository.js";
import * as partnerRepository from "../repository/partner.repository.js";
import * as ngoRepository from "../repository/ngo.repository.js";
import * as trustScoreService from "./trustScore.service.js";
import { sendPaymentConfirmation } from "./email.service.js";

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
        throw new Error("Transaction not found Hub");
    }

    return transaction;
};

export const getTransactionByOrderId = async (orderId) => {
    const transaction = await transactionRepository.findByPayHereOrderId(orderId);
    
    // We must populate this correctly for the success page Hub
    if (transaction) {
        return await transactionRepository.findById(transaction._id);
    }
    
    return null;
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

export const completeDonation = async (transactionId, paymentId, status = "completed") => {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction) throw new Error("Transaction node not found");

    if (transaction.status === "completed") return transaction;

    const previousStatus = transaction.status;
    const updatedTransaction = await transactionRepository.updateById(transactionId, {
        status,
        paymentId,
        completedAt: new Date()
    });

    if (status === "completed") {
        // Increment Campaign raisedAmount
        if (transaction.campaignId) {
            const campaign = await campaignRepository.findById(transaction.campaignId);
            if (campaign) {
                await campaignRepository.updateById(campaign._id, {
                    raisedAmount: (campaign.raisedAmount || 0) + transaction.amount
                });
            }
        }

        // Update Donor totalDonated and analytics
        if (transaction.donorId) {
            const donor = await donorRepository.findByUserId(transaction.donorId);
            if (donor) {
                const currentDonated = (donor.totalDonated || 0) + transaction.amount;
                const currentCount = (donor.analytics?.donationCount || 0) + 1;
                
                await donorRepository.updateById(donor._id, {
                    totalDonated: currentDonated,
                    'analytics.totalDonated': currentDonated,
                    'analytics.donationCount': currentCount,
                    'analytics.lastDonationDate': new Date()
                });

                // --- PLEDGE ACTIVATION ---
                // ...
                if (transaction.type === 'pledge') {
                    const pledgeIndex = donor.pledges.findIndex(p => 
                        p.status === 'pending' && 
                        p.campaign?.toString() === transaction.campaignId?.toString()
                    );
                    
                    if (pledgeIndex !== -1) {
                        donor.pledges[pledgeIndex].status = 'active';
                        donor.pledges[pledgeIndex].startDate = new Date();
                        await donor.save();
                    }
                }
            }
        }

        // --- MILESTONE ACTIVATION ---
        if (transaction.notes) {
            try {
                const notesData = JSON.parse(transaction.notes);
                if (notesData.milestoneId) {
                    if (notesData.isEmbedded && notesData.agreementId) {
                        const mongoose = (await import('mongoose')).default;
                        const Agreement = (await import('../models/agreement.model.js')).default;
                        
                        const agId = String(notesData.agreementId);
                        const mId = String(notesData.milestoneId);
                        
                        let agreementIdObj = mongoose.isValidObjectId(agId) ? new mongoose.Types.ObjectId(agId) : agId;
                        let milestoneIdObj = mongoose.isValidObjectId(mId) ? new mongoose.Types.ObjectId(mId) : mId;

                        const r1 = await Agreement.collection.updateOne(
                            { _id: agreementIdObj, "initialMilestones._id": milestoneIdObj },
                            { $set: { "initialMilestones.$.status": "completed" } }
                        );
                        
                        if (r1.modifiedCount === 0) {
                            const ag = await Agreement.findById(agreementIdObj);
                            if (ag && ag.initialMilestones) {
                                const mIdx = ag.initialMilestones.findIndex(m => String(m._id) === mId);
                                if (mIdx !== -1) {
                                    ag.initialMilestones[mIdx].status = 'completed';
                                    ag.markModified('initialMilestones');
                                    await ag.save({ validateBeforeSave: false });
                                }
                            }
                        }
                    } else {
                        const Milestone = (await import('../models/milestone.model.js')).default;
                        await Milestone.findByIdAndUpdate(notesData.milestoneId, { status: 'completed' });
                    }
                }
            } catch (e) {
                console.error("Failed to parse transaction notes for milestone update:", e);
            }
        }

        // --- NEW: Sync NGO/Partner total contribution stats ---
        if (transaction.ngoId) {
            const ngo = await ngoRepository.findById(transaction.ngoId);
            if (ngo) {
                await ngoRepository.update(ngo._id, {
                    totalFundsRaised: (ngo.totalFundsRaised || 0) + transaction.amount,
                    availableFunds: (ngo.availableFunds || 0) + transaction.amount
                });
            } else {
                const partner = await partnerRepository.findById(transaction.ngoId);
                if (partner) {
                    const totalContributed = (partner.partnershipHistory.totalContributed || 0) + transaction.amount;
                    await partnerRepository.updateById(partner._id, {
                        'partnershipHistory.totalContributed': totalContributed
                    });
                }
            }
        }

        // Trigger Trust Score recalculation for the NGO
        if (transaction.ngoId) {
            trustScoreService.recalculateTrustScore(transaction.ngoId).catch(() => {});
        }
    }

    await auditLogRepository.create({
        entityType: "transaction",
        entityId: transactionId,
        action: "status_update",
        previousData: { status: previousStatus },
        newData: { status }
    });
    
    // Send Email Confirmation
    if (updatedTransaction.status === 'completed' && updatedTransaction.donorId) {
        donorRepository.findByUserId(updatedTransaction.donorId).then(donor => {
            if (donor) {
                const userEmail = donor.userId?.email || donor.email;
                if (userEmail) {
                    sendPaymentConfirmation(userEmail, updatedTransaction).catch(err => console.error('Email failed:', err));
                }
            }
        }).catch(err => console.error('Donor fetch for email failed:', err));
    }

    return updatedTransaction;
};

export const getFinancialSummary = async (ngoId) => {
    return await transactionRepository.getFinancialSummaryByNgo(ngoId);
};
