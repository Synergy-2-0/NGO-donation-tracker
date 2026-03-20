import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Campaign title is required"],
            trim: true,
            minlength: [3, "Campaign title must be at least 3 characters"],
            maxlength: [200, "Campaign title cannot exceed 200 characters"],
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"]
        },
        goalAmount: {
            type: Number,
            required: [true, "Goal amount is required"],
            min: [0, "Goal amount cannot be negative"]
        },
        raisedAmount: {
            type: Number,
            default: 0,
            min: [0, "Raised amount cannot be negative"]
        },
        startDate: {
            type: Date,
            required: [true, "Campaign start date is required"]
        },
        endDate: {
            type: Date,
            required: [true, "Campaign end date is required"],
            validate: {
                validator: function (value) {
                    // End date must be after start date
                    return !this.startDate || value >= this.startDate;
                },
                message: "End date must be greater than or equal to start date"
            }
        },
        status: {
            type: String,
            enum: ["draft", "active", "completed", "archived"],
            default: "draft",
        },
        location: {
            city: {
                type: String,
                trim: true,
                index: true,
            },
            state: {
                type: String,
                trim: true,
                index: true,
            },
            country: {
                type: String,
                trim: true,
                default: 'Sri Lanka',
            },
            coordinates: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point',
                },
                coordinates: {
                    type: [Number],
                },
            },
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

campaignSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model("Campaign", campaignSchema);
