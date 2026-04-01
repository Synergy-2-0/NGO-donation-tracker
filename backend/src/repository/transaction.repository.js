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
    return await Transaction.aggregate([
        { $match: { ngoId: id, status: "completed", archived: false } },
        {
            $group: {
                _id: null,
                totalReceived: { $sum: "$amount" },
                transactionCount: { $sum: 1 },
            },
        },
    ]);
};

export const deleteById = async (id) => {
    return await Transaction.findByIdAndDelete(id);
};
