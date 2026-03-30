export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    if (source === 'query') {
      // req.query is often a read-only getter in some environments, so we Object.assign
      Object.assign(req.query, value);
    } else {
      req[source] = value;
    }
    
    next();
  };
};
