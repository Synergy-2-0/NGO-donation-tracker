import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner",
            required: true,
        },
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: false,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "LKR",
            enum: ["LKR", "USD", "EUR"],
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "PayHere",
        },
        payHereOrderId: {
            type: String,
            unique: true,
            sparse: true,
        },
        paymentId: {
            type: String,
        },
        archived: {
            type: Boolean,
            default: false,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

// Index for efficient queries
transactionSchema.index({ ngoId: 1, status: 1 });
transactionSchema.index({ donorId: 1 });
transactionSchema.index({ campaignId: 1 });

export default mongoose.model("Transaction", transactionSchema);
