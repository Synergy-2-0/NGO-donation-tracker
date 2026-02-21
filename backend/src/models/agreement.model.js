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
    required: [true, 'Description is required'],
    trim: true
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
    enum: ['draft', 'active', 'completed', 'cancelled', 'suspended'],
    default: 'draft',
    index: true
  },
  terms: {
    type: String,
    required: true
  },
  deliverables: [{
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    }
  }],
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
  }
}, {
  timestamps: true
});

export default mongoose.model('Agreement', agreementSchema);
