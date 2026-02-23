import * as auditLogRepository from "../repository/auditLog.repository.js";

export const createAuditLog = async (data) => {
    if (!data.entityType || !data.entityId || !data.action || !data.changedBy) {
        throw new Error(
            "Entity type, entity ID, action, and changedBy are required"
        );
    }

    return await auditLogRepository.create(data);
};

export const getAllAuditLogs = async (limit = 100) => {
    return await auditLogRepository.findAll(limit);
};

export const getAuditLogById = async (id) => {
    const log = await auditLogRepository.findById(id);

    if (!log) {
        throw new Error("Audit log not found");
    }

    return log;
};

export const getAuditLogsByEntityId = async (entityId) => {
    return await auditLogRepository.findByEntityId(entityId);
};

export const getAuditLogsByEntityType = async (entityType) => {
    return await auditLogRepository.findByEntityType(entityType);
};

export const getAuditLogsByUserId = async (userId) => {
    return await auditLogRepository.findByUserId(userId);
};

export const getAuditLogsByDateRange = async (startDate, endDate) => {
    if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
    }

    return await auditLogRepository.findByDateRange(
        new Date(startDate),
        new Date(endDate)
    );
};

export const deleteAuditLog = async (id) => {
    const existingLog = await auditLogRepository.findById(id);

    if (!existingLog) {
        throw new Error("Audit log not found");
    }

    return await auditLogRepository.deleteById(id);
};
