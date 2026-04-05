import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    minlength: [3, 'Organization name must be at least 3 characters long'],
    maxlength: [100, 'Organization name must be less than 100 characters long'],
    index: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    index: true
  },
  mission: {
    type: String,
    required: true
  },
  logoUrl: String,
  contactPhone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'Sri Lanka' },
    postalCode: String
  },
  website: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
    index: true
  },
  verificationDocuments: [{
    documentType: { type: String, enum: ['registration', 'tax_exemption', 'annual_report'] },
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAuditDate: Date,
  totalFundsRaised: { type: Number, default: 0 },
  availableFunds: { type: Number, default: 0 },
  totalBeneficiaries: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('NGO', ngoSchema);
