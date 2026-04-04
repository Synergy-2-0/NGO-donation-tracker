import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

export const create = async (data) => {
    return await Transaction.create(data);
};

export const findAll = async () => {
    return await Transaction.find({ archived: false })
        .populate("donorId", "name email")
        .populate("ngoId", "name")
        .populate("campaignId", "title")
        .sort({ createdAt: -1 });
};

export const findById = async (id) => {
    return await Transaction.findById(id)
        .populate("donorId", "name email")
        .populate("ngoId", "name")
        .populate("campaignId", "title");
};

export const findByNgoId = async (ngoId) => {
    return await Transaction.find({ ngoId, archived: false })
        .populate("donorId", "name email")
        .populate("campaignId", "title")
        .sort({ createdAt: -1 });
};

export const findByDonorId = async (donorId) => {
    return await Transaction.find({ donorId, archived: false })
        .populate("ngoId", "name")
        .populate("campaignId", "title")
        .sort({ createdAt: -1 });
};

export const findByCampaignId = async (campaignId) => {
    return await Transaction.find({ campaignId, archived: false })
        .populate("donorId", "name email")
        .populate("ngoId", "name")
        .sort({ createdAt: -1 });
};

export const findByPayHereOrderId = async (orderId) => {
    return await Transaction.findOne({ orderId });
};

export const updateById = async (id, data) => {
    return await Transaction.findByIdAndUpdate(id, data, { new: true });
};

export const archiveById = async (id) => {
    return await Transaction.findByIdAndUpdate(
        id,
        { archived: true },
        { new: true }
    );
};

export const getFinancialSummaryByNgo = async (ngoId) => {
    const id = typeof ngoId === 'string' ? new mongoose.Types.ObjectId(ngoId) : ngoId;
    
    // Aggregating Income Stream Hub
    const income = await Transaction.aggregate([
        { $match: { ngoId: id, status: "completed", archived: false } },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$amount" },
                transactionCount: { $sum: 1 },
            },
        },
    ]);

    // Aggregate Allocation Deployment Hub
    const FundAllocation = (await import('../models/fundAllocation.model.js')).default;
    const allocations = await FundAllocation.aggregate([
        { $match: { ngoId: id, isDeleted: false } },
        {
            $group: {
                _id: null,
                totalAllocated: { $sum: "$amount" },
            }
        }
    ]);

    const allocationsByCategory = await FundAllocation.aggregate([
        { $match: { ngoId: id, isDeleted: false } },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
            }
        },
        { $sort: { total: -1 } }
    ]);

    const allocationsByCampaign = await FundAllocation.aggregate([
        { $match: { ngoId: id, isDeleted: false, campaignId: { $exists: true } } },
        {
            $group: {
                _id: "$campaignId",
                totalAllocated: { $sum: "$amount" },
            }
        },
        {
            $lookup: {
                from: "campaigns",
                localField: "_id",
                foreignField: "_id",
                as: "campaign"
            }
        },
        { $unwind: "$campaign" },
        {
            $project: {
                title: "$campaign.title",
                totalAllocated: 1
            }
        }
    ]);

    const recentAllocations = await FundAllocation.find({ ngoId: id, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5);

    return {
        totalIncome: income.length > 0 ? income[0].totalIncome : 0,
        transactionCount: income.length > 0 ? income[0].transactionCount : 0,
        totalAllocated: allocations.length > 0 ? allocations[0].totalAllocated : 0,
        allocationsByCategory: allocationsByCategory,
        allocationsByCampaign: allocationsByCampaign,
        recentAllocations: recentAllocations
    };
};

export const deleteById = async (id) => {
    return await Transaction.findByIdAndDelete(id);
};
