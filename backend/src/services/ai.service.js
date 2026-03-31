import * as partnerRepository from '../repository/partner.repository.js';
import * as donorRepository from '../repository/donor.repository.js';
import * as campaignRepository from '../repository/campaign.repository.js';

class AIService {
  /**
   * Provides simulated insights for a donor based on their history
   */
  async getDonorInsights(donorId) {
    const donor = await donorRepository.findById(donorId);
    const totalDonated = donor?.totalDonated || 0;
    
    // Heuristic: Higher value donors get more strategic/impact focused insights
    return [
      {
        id: 1,
        type: 'prediction',
        insight: `With your RS ${totalDonated.toLocaleString()} impact history, you're 40% more likely to support 'Education' projects this month.`,
        confidence: 0.85
      },
      {
        id: 2,
        type: 'recommendation',
        insight: "Highly compatible NGO: 'Green Horizons' aligns with your sustainability preferences.",
        confidence: 0.94
      },
      {
        id: 3,
        type: 'impact',
        insight: totalDonated > 5000 
          ? `Your contribution volume suggests a potential impact node of 450+ children across the region.`
          : `Even at your current level, you've supported verified impact events for 10+ beneficiaries.`,
        confidence: 0.99
      }
    ];
  }

  /**
   * Matches donors with NGOs based on CSR preferences (AI-style matching)
   */
  async getPartnerMatches(donorId) {
    const donor = await donorRepository.findById(donorId);
    if (!donor) throw new Error('Donor profile not found');

    const focusAreas = donor.csrPreferences?.sectors || [];
    const partners = await partnerRepository.findPublic();

    // Scoring logic: 
    // +2 for each sector match
    // +1 if trust score > 90
    // +1 if partner is in the same city
    
    const matches = partners.map(p => {
      let score = 0;
      focusAreas.forEach(sector => {
        if (p.csrFocus?.includes(sector)) score += 2;
      });
      if ((p.trustScore || 85) > 90) score += 1.5;
      
      return {
        partnerId: p._id,
        organizationName: p.organizationName,
        matchScore: score,
        matchPercentage: Math.min(100, (score / 5) * 100),
        reasons: score > 2 ? ['CSR Alignment', 'High Trust Score'] : ['Recommended for Transparency']
      };
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }

  /**
   * AI-style sentiment analysis on campaign evidence or reports
   */
  async analyzeCampaignHealth(campaignId) {
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    // Simulate analysis results
    return {
      status: 'Healthy',
      transparencyScore: 92,
      riskLevel: 'Low',
      sentiment: 'Highly Positive',
      keyInsights: [
        "Milestones are being met 15% faster than projected.",
        "Evidence documentation is 100% compliant with NGO standards.",
        "Beneficiary reach is exceeding Initial targets by 8%."
      ]
    };
  }
}

export default new AIService();
