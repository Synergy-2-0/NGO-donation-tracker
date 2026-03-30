import Joi from 'joi';

const objectId = Joi.string().hex().length(24);
const coordinatePair = Joi.array().items(Joi.number().required()).length(2);

const contactPersonSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  position: Joi.string().trim().required(),
});

const addressSchema = Joi.object({
  street: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().allow('', null),
  country: Joi.string().trim().required(),
  postalCode: Joi.string().trim().required(),
  coordinates: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: coordinatePair.required(),
  }).optional(),
});

const budgetRangeSchema = Joi.object({
  min: Joi.number().min(0).required(),
  max: Joi.number().min(Joi.ref('min')).required(),
});

export const createPartnerSchema = Joi.object({
  logoUrl: Joi.string().uri().allow('', null).optional(),
  organizationName: Joi.string().trim().min(3).max(100).required(),
  organizationType: Joi.string().valid('corporate', 'foundation', 'government', 'individual').required(),
  industry: Joi.string().trim().required(),
  companySize: Joi.string().valid('small', 'medium', 'large', 'enterprise').optional(),
  contactPerson: contactPersonSchema.required(),
  address: addressSchema.required(),
  csrFocus: Joi.array()
    .items(
      Joi.string().valid(
        'education',
        'health',
        'environment',
        'poverty_alleviation',
        'clean_water',
        'sustainable_development',
        'community_development',
        'disaster_relief'
      )
    )
    .min(1)
    .required(),
  sdgGoals: Joi.array().items(Joi.number().integer().min(1).max(17)).optional(),
  partnershipPreferences: Joi.object({
    budgetRange: budgetRangeSchema.required(),
    partnershipTypes: Joi.array()
      .items(Joi.string().valid('financial', 'in-kind', 'skills-based', 'marketing', 'hybrid'))
      .optional(),
    duration: Joi.string().valid('short-term', 'long-term', 'ongoing').optional(),
    geographicFocus: Joi.array().items(Joi.string()).optional(),
  }).required(),
  capabilities: Joi.object({
    financialCapacity: Joi.number().min(0).required(),
    inKindOfferings: Joi.array().items(Joi.string()).optional(),
    skillsAvailable: Joi.array()
      .items(
        Joi.string().valid(
          'legal',
          'marketing',
          'technology',
          'finance',
          'hr',
          'logistics',
          'communications',
          'project_management'
        )
      )
      .optional(),
    employeeCount: Joi.number().integer().min(0).optional(),
    volunteerHoursAvailable: Joi.number().min(0).optional(),
  }).required(),
  verificationDocuments: Joi.array()
    .items(
      Joi.object({
        documentType: Joi.string().valid('registration', 'tax_clearance', 'csr_policy', 'annual_report').required(),
        url: Joi.string().uri().required(),
        uploadedAt: Joi.date().optional(),
        verified: Joi.boolean().optional(),
      })
    )
    .optional(),
  userId: objectId.optional(),
});

export const updatePartnerSchema = Joi.object({
  logoUrl: Joi.string().uri().allow('', null).optional(),
  organizationName: Joi.string().trim().min(3).max(100).optional(),
  organizationType: Joi.string().valid('corporate', 'foundation', 'government', 'individual').optional(),
  industry: Joi.string().trim().optional(),
  companySize: Joi.string().valid('small', 'medium', 'large', 'enterprise').optional(),
  contactPerson: contactPersonSchema.optional(),
  address: addressSchema.optional(),
  csrFocus: Joi.array().items(Joi.string()).min(1).optional(),
  sdgGoals: Joi.array().items(Joi.number().integer().min(1).max(17)).optional(),
  partnershipPreferences: Joi.object({
    budgetRange: budgetRangeSchema.optional(),
    partnershipTypes: Joi.array().items(Joi.string()).optional(),
    duration: Joi.string().valid('short-term', 'long-term', 'ongoing').optional(),
    geographicFocus: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  capabilities: Joi.object({
    financialCapacity: Joi.number().min(0).optional(),
    inKindOfferings: Joi.array().items(Joi.string()).optional(),
    skillsAvailable: Joi.array().items(Joi.string()).optional(),
    employeeCount: Joi.number().integer().min(0).optional(),
    volunteerHoursAvailable: Joi.number().min(0).optional(),
  }).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
  verificationStatus: Joi.string().valid('pending', 'verified', 'rejected').optional(),
  verifiedBy: objectId.optional(),
  verifiedAt: Joi.date().optional(),
}).min(1);
