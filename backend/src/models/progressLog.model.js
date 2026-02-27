import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema(
    {
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: [true, "Associated campaign is required"],
            index: true
        },
        amountRaised: {
            type: Number,
            default: 0,
            min: [0, "Amount raised cannot be negative"]
        },
        beneficiaries: {
            type: Number,
            default: 0,
            min: [0, "Number of beneficiaries cannot be negative"]
        },
        description: {
            type: String,
            required: [true, "Progress description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [1000, "Description cannot exceed 1000 characters"]
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

export default mongoose.model("ProgressLog", progressLogSchema);
