import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const createAgreementSchema = Joi.object({
  partnerId: objectId.required(),
  campaignId: objectId.required(),
  title: Joi.string().trim().min(5).max(200).required(),
  description: Joi.string().trim().allow('').optional(),
  agreementType: Joi.string().valid('financial', 'in-kind', 'skills-based', 'marketing', 'hybrid').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  totalValue: Joi.number().min(0).required(),
  terms: Joi.string().trim().required(),
  documents: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        url: Joi.string().uri().required(),
        uploadedAt: Joi.date().optional(),
      })
    )
    .optional(),
  initialMilestones: Joi.array().items(Joi.object({
    _id: Joi.any().optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    budget: Joi.number().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().optional(),
    evidence: Joi.object({
      url: Joi.string().uri().required(),
      uploadedAt: Joi.date().optional()
    }).optional()
  })).optional(),
  milestones: Joi.array().items(Joi.object({
    _id: Joi.any().optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    budget: Joi.number().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().optional(),
    evidence: Joi.object({
      url: Joi.string().uri().required(),
      uploadedAt: Joi.date().optional()
    }).optional()
  })).optional(),
});

export const updateAgreementSchema = Joi.object({
  partnerId: objectId.optional(),
  campaignId: objectId.required(),
  title: Joi.string().trim().min(5).max(200).optional(),
  description: Joi.string().trim().optional(),
  agreementType: Joi.string().valid('financial', 'in-kind', 'skills-based', 'marketing', 'hybrid').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  totalValue: Joi.number().min(0).optional(),
  terms: Joi.string().trim().optional(),
  documents: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        url: Joi.string().uri().required(),
        uploadedAt: Joi.date().optional(),
      })
    )
    .optional(),
  initialMilestones: Joi.array().items(Joi.object({
    _id: Joi.any().optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    budget: Joi.number().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().optional(),
    evidence: Joi.object({
      url: Joi.string().uri().required(),
      uploadedAt: Joi.date().optional()
    }).optional()
  })).optional(),
  milestones: Joi.array().items(Joi.object({
    _id: Joi.any().optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    budget: Joi.number().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().optional(),
    evidence: Joi.object({
      url: Joi.string().uri().required(),
      uploadedAt: Joi.date().optional()
    }).optional()
  })).optional(),
}).min(1);

export const updateAgreementStatusSchema = Joi.object({
  status: Joi.string().valid('draft', 'pending', 'active', 'completed', 'cancelled', 'suspended', 'signed').required(),
});
