import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        goalAmount: {
            type: Number,
            required: true,
        },
        raisedAmount: {
            type: Number,
            default: 0,
        },
        startDate: Date,
        endDate: Date,
        status: {
            type: String,
            enum: ["draft", "active", "completed", "archived"],
            default: "draft",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
