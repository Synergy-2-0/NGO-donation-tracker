import Joi from "joi";

const objectId = Joi.string().hex().length(24);

// Transaction validators
export const createTransactionSchema = Joi.object({
    donorId: objectId.required(),
    ngoId: objectId.required(),
    campaignId: objectId.optional(),
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid("LKR", "USD", "EUR").default("LKR"),
    paymentMethod: Joi.string().default("PayHere"),
    notes: Joi.string().optional(),
});

export const updateTransactionSchema = Joi.object({
    status: Joi.string().valid("pending", "completed", "failed").optional(),
    notes: Joi.string().optional(),
    amount: Joi.number().min(1).optional(),
}).min(1);

// Fund allocation validators
export const createAllocationSchema = Joi.object({
    transactionId: objectId.required(),
    ngoId: objectId.required(),
    category: Joi.string()
        .valid(
            "education",
            "healthcare",
            "infrastructure",
            "food",
            "clothing",
            "emergency-relief",
            "administrative",
            "other"
        )
        .required(),
    amount: Joi.number().min(1).required(),
    description: Joi.string().min(5).max(500).required(),
});

export const updateAllocationSchema = Joi.object({
    category: Joi.string()
        .valid(
            "education",
            "healthcare",
            "infrastructure",
            "food",
            "clothing",
            "emergency-relief",
            "administrative",
            "other"
        )
        .optional(),
    amount: Joi.number().min(1).optional(),
    description: Joi.string().min(5).max(500).optional(),
}).min(1);

// PayHere init validator
export const payHereInitSchema = Joi.object({
    donorId: objectId.required(),
    ngoId: objectId.required(),
    campaignId: objectId.optional(),
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid("LKR", "USD", "EUR").default("LKR"),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
});

// Audit log validator
export const createAuditLogSchema = Joi.object({
    entityType: Joi.string()
        .valid("transaction", "fundAllocation", "campaign", "partner")
        .required(),
    entityId: objectId.required(),
    action: Joi.string().valid("create", "update", "delete", "archive").required(),
    changedBy: objectId.required(),
    changedByRole: Joi.string().optional(),
    previousData: Joi.object().optional(),
    newData: Joi.object().optional(),
    ipAddress: Joi.string().optional(),
    userAgent: Joi.string().optional(),
});

// Validator middleware
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }

        req.body = value;
        next();
    };
};
