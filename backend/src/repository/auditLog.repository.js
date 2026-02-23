import AuditLog from "../models/auditLog.model.js";

export const create = async (data) => {
    return await AuditLog.create(data);
};

export const findAll = async (limit = 100) => {
    return await AuditLog.find()
        .populate("changedBy", "name email role")
        .sort({ createdAt: -1 })
        .limit(limit);
};

export const findById = async (id) => {
    return await AuditLog.findById(id).populate("changedBy", "name email role");
};

export const findByEntityId = async (entityId) => {
    return await AuditLog.find({ entityId })
        .populate("changedBy", "name email role")
        .sort({ createdAt: -1 });
};

export const findByEntityType = async (entityType) => {
    return await AuditLog.find({ entityType })
        .populate("changedBy", "name email role")
        .sort({ createdAt: -1 });
};

export const findByUserId = async (userId) => {
    return await AuditLog.find({ changedBy: userId })
        .sort({ createdAt: -1 });
};

export const findByDateRange = async (startDate, endDate) => {
    return await AuditLog.find({
        createdAt: { $gte: startDate, $lte: endDate },
    })
        .populate("changedBy", "name email role")
        .sort({ createdAt: -1 });
};

export const deleteById = async (id) => {
    return await AuditLog.findByIdAndDelete(id);
};
