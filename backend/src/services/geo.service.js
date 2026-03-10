import Partner from '../models/partner.model.js';
import { getCache, setCache } from '../utils/cache.js';

class GeoService {
  /**
   * Find verified active partners within a radius (km) of [longitude, latitude].
   * Requires a 2dsphere index on address.coordinates.
   */
  async findPartnersNearby(longitude, latitude, radiusInKm = 50) {
    return await Partner.find({
      'address.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusInKm * 1000,
        },
      },
      verificationStatus: 'verified',
      status: 'active',
    }).select(
      'organizationName organizationType csrFocus address.city address.state address.coordinates partnershipHistory'
    );
  }

  /**
   * Find verified active partners by city and/or state (case-insensitive).
   */
  async getPartnersByRegion(city, state) {
    const query = { verificationStatus: 'verified', status: 'active' };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');

    return await Partner.find(query).select(
      'organizationName organizationType csrFocus address.city address.state address.coordinates partnershipHistory'
    );
  }

  /**
   * Returns partner counts and contribution totals grouped by city/state.
   * Cached for 30 minutes.
   */
  async getHeatmapData() {
    const cacheKey = 'geo:heatmap';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const result = await Partner.aggregate([
      { $match: { verificationStatus: 'verified', status: 'active' } },
      {
        $group: {
          _id: {
            city: '$address.city',
            state: '$address.state',
            country: '$address.country',
          },
          partnerCount: { $sum: 1 },
          totalContributed: { $sum: '$partnershipHistory.totalContributed' },
          coordinates: { $first: '$address.coordinates.coordinates' },
        },
      },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          state: '$_id.state',
          country: '$_id.country',
          partnerCount: 1,
          totalContributed: 1,
          coordinates: 1,
        },
      },
      { $sort: { partnerCount: -1 } },
    ]);

    setCache(cacheKey, result, 1800);
    return result;
  }

  /**
   * Returns geographic areas grouped by CSR focus with highest contribution totals.
   * Cached for 30 minutes.
   */
  async getImpactZones() {
    const cacheKey = 'geo:impact-zones';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const result = await Partner.aggregate([
      { $match: { verificationStatus: 'verified', status: 'active' } },
      { $unwind: '$csrFocus' },
      {
        $group: {
          _id: '$csrFocus',
          partnerCount: { $sum: 1 },
          totalContributed: { $sum: '$partnershipHistory.totalContributed' },
          locations: {
            $push: {
              coordinates: '$address.coordinates.coordinates',
              city: '$address.city',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          focusArea: '$_id',
          partnerCount: 1,
          totalContributed: 1,
          locations: { $slice: ['$locations', 10] },
        },
      },
      { $sort: { totalContributed: -1 } },
    ]);

    setCache(cacheKey, result, 1800);
    return result;
  }
}

export default new GeoService();
