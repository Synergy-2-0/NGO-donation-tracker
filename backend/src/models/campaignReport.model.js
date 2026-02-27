import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: [true, "Associated campaign is required"],
            index: true
        },
        summary: {
            type: String,
            required: [true, "Report summary is required"],
            trim: true,
            minlength: [10, "Summary must be at least 10 characters long"],
            maxlength: [2000, "Summary cannot exceed 2000 characters"]
        },
        totalRaised: {
            type: Number,
            required: [true, "Total raised amount is required"],
            min: [0, "Total raised cannot be negative"]
        },
        beneficiaries: {
            type: Number,
            required: [true, "Number of beneficiaries is required"],
            min: [0, "Beneficiaries cannot be negative"]
        },
        evidence: [
            {
                type: String,
                trim: true,
                validate: {
                    validator: function (url) {
                        return typeof url === "string";
                    },
                    message: "Evidence must be a string URL"
                }
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("CampaignReport", reportSchema);
