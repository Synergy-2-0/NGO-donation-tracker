import * as auditLogService from "../services/auditLog.service.js";

// Get all audit logs (admin only)
export const getAllAuditLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = await auditLogService.getAllAuditLogs(limit);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single audit log
export const getAuditLogById = async (req, res) => {
    try {
        const log = await auditLogService.getAuditLogById(req.params.id);
        res.json(log);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get audit logs by entity ID
export const getAuditLogsByEntityId = async (req, res) => {
    try {
        const logs = await auditLogService.getAuditLogsByEntityId(req.params.id);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get audit logs by entity type
export const getAuditLogsByEntityType = async (req, res) => {
    try {
        const logs = await auditLogService.getAuditLogsByEntityType(
            req.params.type
        );
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get audit logs by user ID
export const getAuditLogsByUserId = async (req, res) => {
    try {
        const logs = await auditLogService.getAuditLogsByUserId(req.params.id);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get audit logs by date range
export const getAuditLogsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const logs = await auditLogService.getAuditLogsByDateRange(
            startDate,
            endDate
        );
        res.json(logs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete audit log (admin only)
export const deleteAuditLog = async (req, res) => {
    try {
        await auditLogService.deleteAuditLog(req.params.id);
        res.json({ message: "Audit log deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
