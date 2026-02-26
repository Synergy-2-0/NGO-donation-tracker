import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'call', 'meeting', 'event', 'other'],
    required: true
  },
  note: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  conductedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: true, timestamps: true });

const pledgeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Pledge amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  frequency: {
    type: String,
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    default: 'one-time'
  },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  status: {
    type: String,
    enum: ['pending', 'active', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  notes: String
}, { _id: true, timestamps: true });

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'Sri Lanka' },
    postalCode: String
  },
  dateOfBirth: Date,
  preferredCommunication: {
    type: String,
    enum: ['email', 'phone', 'sms'],
    default: 'email'
  },
  segment: {
    type: String,
    enum: ['new', 'regular', 'major', 'lapsed', 'vip'],
    default: 'new',
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active',
    index: true
  },
  pledges: [pledgeSchema],
  interactions: [interactionSchema],
  analytics: {
    totalDonated: { type: Number, default: 0, min: 0 },
    donationCount: { type: Number, default: 0, min: 0 },
    lastDonationDate: Date,
    averageDonation: { type: Number, default: 0 },
    retentionScore: { type: Number, default: 0, min: 0, max: 100 }
  },
  notes: String,
  tags: [String],
  gdprConsent: {
    given: { type: Boolean, default: false },
    date: Date,
    version: String
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual: full donor info via userId population
donorSchema.virtual('profile', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model('Donor', donorSchema);