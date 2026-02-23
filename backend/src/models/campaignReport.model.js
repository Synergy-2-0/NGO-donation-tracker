import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        totalRaised: {
            type: Number,
            required: true,
        },
        beneficiaries: {
            type: Number,
            required: true,
        },
        evidence: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("CampaignReport", reportSchema);
