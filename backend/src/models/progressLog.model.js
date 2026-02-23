import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema(
    {
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
        amountRaised: {
            type: Number,
            default: 0,
        },
        beneficiaries: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            required: true,
        },
        evidence: {
            type: [String],
        },
    },
    { timestamps: true }
);

export default mongoose.model("ProgressLog", progressLogSchema);
