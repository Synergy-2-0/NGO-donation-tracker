import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
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
        image: {
            type: String,
            default: null,
            trim: true
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
            enum: ["draft", "pending", "active", "completed", "archived"],
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
        sdgAlignment: {
            type: [Number],
            validate: {
                validator: function(arr) {
                    return arr.every(num => num >= 1 && num <= 17);
                },
                message: 'SDG goals must be between 1 and 17'
            },
            index: true
        },
        targetBeneficiaries: {
            type: Number,
            default: 0
        },
        reachedBeneficiaries: {
            type: Number,
            default: 0
        },
        costPerBeneficiary: {
            type: Number,
            default: 0
        },
        roiEstimation: {
            type: Number,
            default: 0
        },
        impactPercentage: {
            type: Number,
            default: 0
        },
        evidence: [{
            title: String,
            url: String,
            uploadedAt: { type: Date, default: Date.now }
        }],
        isDeleted: {
            type: Boolean,
            default: false,
        },
        allowPledges: {
            type: Boolean,
            default: false,
        },
        pledgeConfig: {
            frequencies: {
                type: [String],
                enum: ['monthly', 'quarterly', 'yearly'],
                default: ['monthly'],
            },
            minimumAmount: {
                type: Number,
                default: 500,
                min: [0, 'Minimum pledge amount cannot be negative'],
            },
            suggestedAmounts: {
                type: [Number],
                default: [],
            },
            maxDurationMonths: {
                type: Number,
                default: 12,
            },
            donorNote: {
                type: String,
                trim: true,
                maxlength: [500, 'Donor note cannot exceed 500 characters'],
                default: '',
            },
        },
    },
    { timestamps: true }
);
campaignSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model("Campaign", campaignSchema);
