import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const createMilestoneSchema = Joi.object({
  agreementId: objectId.required(),
  campaignId: objectId.required(),
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().allow('', null).optional(),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  budget: Joi.number().min(0).optional(),
  amount: Joi.number().min(0).optional(),
  completedAt: Joi.date().optional(),
  evidence: Joi.object({
    url: Joi.string().uri().required(),
    uploadedAt: Joi.date().optional(),
  }).optional(),
});

export const updateMilestoneSchema = Joi.object({
  agreementId: objectId.optional(),
  campaignId: objectId.optional(),
  title: Joi.string().trim().min(3).max(200).optional(),
  description: Joi.string().allow('', null).optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  budget: Joi.number().min(0).optional(),
  amount: Joi.number().min(0).optional(),
  completedAt: Joi.date().optional(),
  evidence: Joi.object({
    url: Joi.string().uri().required(),
    uploadedAt: Joi.date().optional(),
  }).optional(),
}).min(1);

export const milestoneQuerySchema = Joi.object({
  agreementId: objectId.optional(),
  campaignId: objectId.optional(),
});
