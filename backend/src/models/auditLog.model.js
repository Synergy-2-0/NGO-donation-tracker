import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        entityType: {
            type: String,
            required: true,
            enum: ["transaction", "fundAllocation", "campaign", "partner"],
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: ["create", "update", "delete", "archive", "status_update"],
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        changedByRole: {
            type: String,
        },
        previousData: {
            type: mongoose.Schema.Types.Mixed,
        },
        newData: {
            type: mongoose.Schema.Types.Mixed,
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
    },
    { timestamps: true }
);

// Index for efficient queries
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ changedBy: 1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
