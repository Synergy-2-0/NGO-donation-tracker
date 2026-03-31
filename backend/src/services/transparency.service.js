import * as partnerRepository from '../repository/partner.repository.js';
import * as agreementRepository from '../repository/agreement.repository.js';
import { getCache, setCache } from '../utils/cache.js';

function sanitizePartner(partner) {
  return {
    organizationName: partner.organizationName,
    organizationType: partner.organizationType,
    csrFocus: partner.csrFocus,
    totalContributed: partner.partnershipHistory.totalContributed || 0,
    activePartnerships: partner.partnershipHistory.activePartnerships || 0,
    completedPartnerships: partner.partnershipHistory.completedPartnerships || 0,
    trustScore: partner.trustScore || 85 // Fallback to a default if not calculated
  };
}

class TransparencyService {
  /**
   * Returns sanitized public list of verified active partners.
   * Cached for 1 hour.
   */
  async getPublicDashboard() {
    const cacheKey = 'transparency:dashboard';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const partners = await partnerRepository.findPublic();
    const result = partners.map(sanitizePartner);
    setCache(cacheKey, result, 3600);
    return result;
  }

  /**
   * Returns active/completed agreements for a verified partner (no sensitive fields).
   * Cached for 1 hour.
   */
  async getPartnerPublicAgreements(partnerId) {
    const partner = await partnerRepository.findById(partnerId);
    if (!partner || partner.verificationStatus !== 'verified') {
      throw new Error('Partner not found');
    }

    const cacheKey = `transparency:partner:${partnerId}:agreements`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const agreements = await agreementRepository.findByPartnerId(partnerId);
    const result = agreements
      .filter(a => ['active', 'completed'].includes(a.status))
      .map(a => ({
        title: a.title,
        agreementType: a.agreementType,
        totalValue: a.totalValue,
        status: a.status,
        startDate: a.startDate,
        endDate: a.endDate,
      }));

    setCache(cacheKey, result, 3600);
    return result;
  }

  /**
   * Returns aggregated impact metrics across all verified partners.
   * Cached for 1 hour.
   */
  async getImpactMetrics() {
    const cacheKey = 'transparency:impact-metrics';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const partners = await partnerRepository.findPublic();

    const totalPartnerships = partners.reduce(
      (s, p) => s + p.partnershipHistory.totalPartnerships, 0
    );
    const totalFundsAllocated = partners.reduce(
      (s, p) => s + p.partnershipHistory.totalContributed, 0
    );

    const activeAgreements = partners.reduce(
      (s, p) => s + p.partnershipHistory.activePartnerships, 0
    );
    const completedProjects = partners.reduce(
      (s, p) => s + p.partnershipHistory.completedPartnerships, 0
    );

    const metrics = {
      totalPartnerships,
      totalFundsAllocated,
      activeAgreements,
      completedProjects,
      verifiedPartners: partners.length,
      totalBeneficiaries: 12500, // Simulated for now
      milestonesCompleted: 42,   // Simulated
      globalReachCities: [...new Set(partners.map(p => p.address?.city).filter(Boolean))].length
    };

    setCache(cacheKey, metrics, 3600);
    return metrics;
  }

  /**
   * Get public donor leaderboard / statistics
   */
  async getPublicDonorStats() {
    const cacheKey = 'transparency:donor-stats';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    // Simulated data for demo purposes - usually would aggregate transaction models
    const stats = {
      totalDonors: 1450,
      activeDonors: 890,
      topCauses: ['Education', 'Healthcare', 'Environment'],
      donorGrowthRate: 15.4,
      avgDonationAmount: 250
    };

    setCache(cacheKey, stats, 3600);
    return stats;
  }

  /**
   * Returns data for GeoJSON/Mapbox public map
   */
  async getMapData() {
    const partners = await partnerRepository.findPublic();
    
    return {
      type: 'FeatureCollection',
      features: partners.map(p => ({
        type: 'Feature',
        properties: {
          name: p.organizationName,
          type: p.organizationType,
          city: p.address.city,
          focus: p.csrFocus,
          trustScore: p.trustScore || 85
        },
        geometry: p.address.coordinates
      }))
    };
  }
}

export default new TransparencyService();
