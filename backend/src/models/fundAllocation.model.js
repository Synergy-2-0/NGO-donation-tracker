import mongoose from "mongoose";

const fundAllocationSchema = new mongoose.Schema(
    {
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            required: true,
        },
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner",
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "education",
                "healthcare",
                "infrastructure",
                "food",
                "clothing",
                "emergency-relief",
                "administrative",
                "other",
            ],
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Index for efficient queries
fundAllocationSchema.index({ transactionId: 1 });
fundAllocationSchema.index({ ngoId: 1, isDeleted: 1 });

export default mongoose.model("FundAllocation", fundAllocationSchema);
