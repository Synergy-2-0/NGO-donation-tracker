import Joi from 'joi';

export const geoPartnersQuerySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).optional(),
  lng: Joi.number().min(-180).max(180).optional(),
  radius: Joi.number().min(1).max(500).optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
}).custom((value, helpers) => {
  const hasCoordinates = value.lat !== undefined || value.lng !== undefined;
  const hasBothCoordinates = value.lat !== undefined && value.lng !== undefined;
  const hasRegion = value.city || value.state;

  if (hasCoordinates && !hasBothCoordinates) {
    return helpers.error('any.invalid', { message: 'Both lat and lng must be provided together' });
  }

  if (!hasBothCoordinates && !hasRegion) {
    return helpers.error('any.invalid', { message: 'Provide lat/lng or city/state query parameters' });
  }

  return value;
}, 'Geo query validation');
