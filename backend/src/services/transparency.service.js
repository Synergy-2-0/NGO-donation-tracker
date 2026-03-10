import partnerRepository from '../repository/partner.repository.js';
import agreementRepository from '../repository/agreement.repository.js';
import { getCache, setCache } from '../utils/cache.js';

function sanitizePartner(partner) {
  return {
    organizationName: partner.organizationName,
    organizationType: partner.organizationType,
    csrFocus: partner.csrFocus,
    totalContributed: partner.partnershipHistory.totalContributed,
    activePartnerships: partner.partnershipHistory.activePartnerships,
    completedPartnerships: partner.partnershipHistory.completedPartnerships,
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
    };

    setCache(cacheKey, metrics, 3600);
    return metrics;
  }
}

export default new TransparencyService();
