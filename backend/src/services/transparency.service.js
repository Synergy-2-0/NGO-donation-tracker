import partnerRepository from '../repository/partner.repository.js';
import agreementRepository from '../repository/agreement.repository.js';
import Campaign from '../models/campaign.model.js';
import Milestone from '../models/milestone.model.js';
import Transaction from '../models/transaction.model.js';
import Partner from '../models/partner.model.js';
import NGO from '../models/ngo.model.js';
import { getCache, setCache } from '../utils/cache.js';

function sanitizePartner(partner) {
  return {
    _id: partner._id,
    organizationName: partner.organizationName,
    organizationType: partner.organizationType,
    industry: partner.industry,
    csrFocus: partner.csrFocus,
    totalContributed: partner.partnershipHistory?.totalContributed || 0,
    activePartnerships: partner.partnershipHistory?.activePartnerships || 0,
    completedPartnerships: partner.partnershipHistory?.completedPartnerships || 0,
    trustScore: partner.trustScore || 85,
    contactPerson: {
      name: partner.contactPerson?.name,
      email: partner.contactPerson?.email,
      phone: partner.contactPerson?.phone,
      position: partner.contactPerson?.position
    },
    address: partner.address,
    verificationStatus: partner.verificationStatus
  };
}

class TransparencyService {
  /**
   * Returns sanitized public list of verified active partners.
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

  async getImpactMetrics() {
    // Comprehensive Impact Aggregation
    const [partners, campaigns, completedMilestones, transactionStats] = await Promise.all([
      partnerRepository.findPublic(),
      Campaign.find({ isDeleted: false }),
      Milestone.countDocuments({ status: 'completed' }),
      Transaction.aggregate([
        { $match: { status: 'completed', archived: false } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    // Sum of Partner Contributions
    const partnerFunds = partners.reduce(
      (s, p) => s + (p.partnershipHistory?.totalContributed || 0), 0
    );

    // Sum of Public Donations
    const publicFunds = transactionStats[0]?.total || 0;

    // Total Monetary Reach
    const totalFundsAllocated = partnerFunds + publicFunds;

    const totalBeneficiaries = campaigns.reduce(
      (s, c) => s + (c.reachedBeneficiaries || 0), 0
    );

    const recentMilestones = await Milestone.find({ status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('campaignId');

    return {
      totalFundsAllocated,
      totalBeneficiaries: totalBeneficiaries || 0,
      milestonesCompleted: completedMilestones,
      recentMilestones: recentMilestones.map(m => ({
        title: m.title,
        campaign: m.campaignId?.title || 'General Platform',
        date: m.completedAt || m.updatedAt
      })),
      verifiedPartners: partners.length,
      globalReachCities: [...new Set(partners.map(p => p.address?.city).filter(Boolean))].length
    };
  }

  async getPublicDonorStats() {
    // Market Dynamics Aggregation Hub
    const transactions = await Transaction.aggregate([
      { $match: { status: 'completed', archived: false } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          donors: { $addToSet: '$donorId' }
        }
      }
    ]);

    const statsGroup = transactions[0] || { totalAmount: 0, count: 0, donors: [] };

    // Find top SDG Alignments from active campaigns Hub
    const topCategories = await Campaign.aggregate([
      { $match: { status: 'active', isDeleted: false, sdgAlignment: { $exists: true, $ne: [] } } },
      { $unwind: '$sdgAlignment' },
      { $group: { _id: '$sdgAlignment', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    
    // SDG Mapper Hub
    const sdgMap = {
      1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health', 4: 'Quality Education', 
      5: 'Gender Equality', 6: 'Clean Water', 7: 'Clean Energy', 8: 'Economy & Work', 
      9: 'Infrastructure', 10: 'Reduced Inequalities', 11: 'Sustainable Cities', 
      12: 'Responsible Consumption', 13: 'Climate Action', 14: 'Life Below Water', 
      15: 'Life on Land', 16: 'Peace & Justice', 17: 'Partnerships'
    };

    // Trends calculation 
    const recentTxCount = await Transaction.countDocuments({ 
      status: 'completed', 
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });

    const previousTxCount = await Transaction.countDocuments({ 
      status: 'completed', 
      createdAt: { 
        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      } 
    });

    let growthRate = 0;
    if (previousTxCount > 0) {
      growthRate = ((recentTxCount - previousTxCount) / previousTxCount) * 100;
    } else if (recentTxCount > 0) {
      growthRate = 100;
    }

    return {
      totalDonors: statsGroup.donors.length,
      activeDonors: statsGroup.donors.length,
      topCauses: topCategories.length > 0 ? topCategories.map(c => sdgMap[c._id] || `SDG ${c._id}`) : ['Humanitarian Aid', 'Education', 'Social Welfare'], 
      donorGrowthRate: growthRate.toFixed(1), 
      avgDonationAmount: statsGroup.count > 0 ? Math.round(statsGroup.totalAmount / statsGroup.count) : 0
    };
  }


  async getMapData() {
    const [partners, campaigns] = await Promise.all([
      partnerRepository.findPublic(),
      Campaign.find({ isDeleted: false, "location.coordinates": { $exists: true } }).populate('createdBy')
    ]);

    // Fetch NGOs to map userId to trustScore
    const ngos = await NGO.find({ status: 'approved' });
    const ngoMap = ngos.reduce((acc, n) => {
      acc[n.userId.toString()] = n.trustScore || 0;
      return acc;
    }, {});
    
    const partnerFeatures = partners.map(p => {
      // Ensure coordinates are in [lng, lat] format for GeoJSON
      const coords = p.address?.coordinates?.coordinates || p.address?.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) return null;

      return {
        type: 'Feature',
        properties: {
          name: p.organizationName,
          type: 'Institutional Partner Hub',
          city: p.address?.city || 'Verified Hub',
          focus: (p.csrFocus || []).join(', ') || 'Global Impact Hub',
          trustScore: p.trustScore || 85
        },
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      };
    }).filter(Boolean);

    const campaignFeatures = campaigns.map(c => {
      const creatorId = c.createdBy?._id || c.createdBy;
      const score = ngoMap[creatorId?.toString()] || 0;
      
      // Handle the nested coordinates structure in the Campaign model
      const coords = c.location?.coordinates?.coordinates || c.location?.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) return null;

      return {
        type: 'Feature',
        properties: {
          name: c.title,
          type: 'Active Social Mission Hub',
          city: c.location?.city || 'Global Hub',
          focus: c.description?.slice(0, 70) + '...',
          trustScore: score || 75
        },
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      };
    }).filter(Boolean);

    return {
      type: 'FeatureCollection',
      features: [...partnerFeatures, ...campaignFeatures]
    };
  }

  async getLeaderboard() {
      // NGO Trust Leaderboard Hub Hub Hub
      const ngos = await NGO.find({ status: 'approved', isPublic: true })
          .sort({ trustScore: -1 })
          .limit(5);

      return ngos.map(n => ({
          name: n.organizationName,
          score: n.trustScore || 0,
          level: (n.trustScore || 0) >= 90 ? 'Excellent' : 'Verified Hub'
      }));
  }

  async getTrends() {
      // Fund Allocation Trends (Last 6 Months) Hub Hub Hub
      const trends = await Transaction.aggregate([
          { $match: { status: 'completed', archived: false } },
          {
              $group: {
                  _id: { $month: "$createdAt" },
                  val: { $sum: "$amount" }
              }
          },
          { $sort: { "_id": 1 } }
      ]);

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (5 - i));
          return monthNames[d.getMonth()];
      });

      return months.map(m => {
          const match = trends.find(t => monthNames[t._id - 1] === m);
          return { name: m, val: match ? match.val : 0 };
      });
  }

  async getCampaignPublicPartners(campaignId) {
    const agreements = await agreementRepository.findAll({ 
      campaignId, 
      status: { $in: ['active', 'completed'] } 
    });
    
    // Calculate total pledged by institutional partners Hub
    const totalPledged = agreements.reduce((sum, a) => sum + (a.totalValue || 0), 0);

    const partnerIds = [...new Set(agreements.map(a => (a.partnerId?._id || a.partnerId).toString()))];
    
    if (partnerIds.length === 0) return { partners: [], totalPledged: 0 };

    const partners = await Partner.find({ 
      _id: { $in: partnerIds },
      verificationStatus: 'verified'
    });
    
    return {
      partners: partners.map(sanitizePartner),
      totalPledged
    };
  }
}

export default new TransparencyService();
