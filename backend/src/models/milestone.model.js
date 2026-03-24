import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  agreementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agreement',
    required: true,
    index: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  completedAt: Date,
  evidence: {
    url: String,
    uploadedAt: Date
  }
}, { timestamps: true });

milestoneSchema.index({ campaignId: 1, dueDate: 1 });

export default mongoose.model('Milestone', milestoneSchema);
