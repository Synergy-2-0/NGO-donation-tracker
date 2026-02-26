import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  agreementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agreement',
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
  completedAt: Date,
  evidence: {
    url: String,
    uploadedAt: Date
  }
}, { timestamps: true });

export default mongoose.model('Milestone', milestoneSchema);
