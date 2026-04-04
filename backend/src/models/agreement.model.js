import mongoose from 'mongoose';

const agreementSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Agreement title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title must be less than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  agreementType: {
    type: String,
    required: true,
    enum: ['financial', 'in-kind', 'skills-based', 'marketing', 'hybrid'],
    index: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  totalValue: {
    type: Number,
    required: true,
    min: [0, 'Total value cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'completed', 'cancelled', 'suspended', 'signed'],
    default: 'draft',
    index: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  partnerAcceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  partnerAcceptedAt: {
    type: Date,
    default: null
  },
  terms: {
    type: String,
    required: true
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    default: null,
    index: true
  },
  initialMilestones: [{
    title: String,
    description: String,
    budget: Number,
    dueDate: Date,
    status: { type: String, default: 'pending' },
    evidence: {
      url: String,
      uploadedAt: Date
    }
  }],
  milestones: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model('Agreement', agreementSchema);
