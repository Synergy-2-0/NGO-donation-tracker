import FundAllocation from "../models/fundAllocation.model.js";

export const create = async (data) => {
    return await FundAllocation.create(data);
};

export const findAll = async () => {
    return await FundAllocation.find({ isDeleted: false })
        .populate("transactionId")
        .populate("ngoId", "name")
        .sort({ createdAt: -1 });
};

export const findById = async (id) => {
    return await FundAllocation.findById(id)
        .populate("transactionId")
        .populate("ngoId", "name");
};

export const findByNgoId = async (ngoId) => {
    return await FundAllocation.find({ ngoId, isDeleted: false })
        .populate("transactionId")
        .sort({ createdAt: -1 });
};

export const findByTransactionId = async (transactionId) => {
    return await FundAllocation.find({ transactionId, isDeleted: false });
};

export const updateById = async (id, data) => {
    return await FundAllocation.findByIdAndUpdate(id, data, { new: true });
};

export const softDelete = async (id) => {
    return await FundAllocation.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
};

export const getTotalAllocatedByNgo = async (ngoId) => {
    return await FundAllocation.aggregate([
        { $match: { ngoId: ngoId, isDeleted: false } },
        {
            $group: {
                _id: null,
                totalAllocated: { $sum: "$amount" },
            },
        },
    ]);
};

export const getAllocationsByCategory = async (ngoId) => {
    return await FundAllocation.aggregate([
        { $match: { ngoId: ngoId, isDeleted: false } },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        { $sort: { total: -1 } },
    ]);
};

export const deleteById = async (id) => {
    return await FundAllocation.findByIdAndDelete(id);
};
