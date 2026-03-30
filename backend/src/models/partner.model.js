import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  // Organization details
  logoUrl: { type: String, default: '' },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    minlength: [3, 'Organization name must be at least 3 characters long'],
    maxlength: [100, 'Organization name must be less than 100 characters long'],
    index: true
  },

  // Organization type with validation
  organizationType: {
    type: String,
    required: [true, 'Organization type is required'],
    enum: {
      values: ['corporate', 'foundation', 'government', 'individual'],
      message: '{VALUE} is not a valid organization type'
    },
    index: true
  },

  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
    index: true
  },

  companySize: {
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    default: 'medium'
  },

  // Contact person information
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Contact person email is required'],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone number is required'],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number']
    },
    position: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Address with geolocation support
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    country: {
      type: String,
      required: true,
      default: 'Sri Lanka',
      index: true
    },
    postalCode: { type: String, required: true },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },

  // CSR focus areas
  csrFocus: {
    type: [String],
    required: [true, 'At least one CSR focus area is required'],
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one CSR focus area must be selected'
    },
    enum: [
      'education',
      'health',
      'environment',
      'poverty_alleviation',
      'clean_water',
      'sustainable_development',
      'community_development',
      'disaster_relief'
    ]
  },

  sdgGoals: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return arr.every(num => num >= 1 && num <= 17);
      },
      message: 'SDG goals must be between 1 and 17'
    },
    index: true
  },

  // Partnership preferences and budget
  partnershipPreferences: {
    budgetRange: {
      min: {
        type: Number,
        required: true,
        min: [0, 'Minimum budget must be a positive number']
      },
      max: {
        type: Number,
        required: true
      }
    },
    partnershipTypes: {
      type: [String],
      enum: ['financial', 'in-kind', 'skills-based', 'marketing', 'hybrid'],
      default: ['financial']
    },
    duration: {
      type: String,
      enum: ['short-term', 'long-term', 'ongoing'],
      default: 'long-term'
    },
    geographicFocus: [String]
  },

  // Partner capabilities and resources
  capabilities: {
    financialCapacity: {
      type: Number,
      required: true,
      min: [0, 'Financial capacity cannot be negative']
    },
    inKindOfferings: [String],
    skillsAvailable: {
      type: [String],
      enum: [
        'legal',
        'marketing',
        'technology',
        'finance',
        'hr',
        'logistics',
        'communications',
        'project_management'
      ]
    },
    employeeCount: Number,
    volunteerHoursAvailable: Number
  },

  // Verification status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
    index: true
  },

  verificationDocuments: [
    {
      documentType: {
        type: String,
        enum: ['registration', 'tax_clearance', 'csr_policy', 'annual_report'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      verified: {
        type: Boolean,
        default: false
      }
    }
  ],

  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Partnership history metrics
  partnershipHistory: {
    totalPartnerships: {
      type: Number,
      default: 0,
      min: 0
    },
    activePartnerships: {
      type: Number,
      default: 0,
      min: 0
    },
    completedPartnerships: {
      type: Number,
      default: 0,
      min: 0
    },
    totalContributed: {
      type: Number,
      default: 0,
      min: 0
    }
  },

  // Partner account status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true
  },

  // Reference to user account
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

partnerSchema.index({ 'address.coordinates': '2dsphere' });

export default mongoose.model('Partner', partnerSchema);