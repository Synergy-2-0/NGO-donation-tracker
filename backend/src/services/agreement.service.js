import agreementRepository from '../repository/agreement.repository.js';
import partnerRepository from '../repository/partner.repository.js';
import * as ngoRepository from '../repository/ngo.repository.js';
import Campaign from '../models/campaign.model.js';

class AgreementService {
  _extractPartnerId(partnerId) {
    if (!partnerId) return null;
    if (typeof partnerId === 'string') return partnerId;
    if (typeof partnerId === 'object') {
      if (partnerId._id) return partnerId._id.toString();
      if (partnerId.id) return partnerId.id.toString();
    }
    return null;
  }

  // Strategic Institutional Guard Hub
  async _ensureNgoApproved(userId) {
    const ngo = await ngoRepository.findByUserId(userId);
    if (!ngo || ngo.status !== 'approved') {
        throw new Error("Your organization is currently awaiting verification. Institutional partnerships are locked until approval Sync!");
    }
    return ngo;
  }

  async createAgreement(data, user) {
    const normalizedPartnerId = this._extractPartnerId(data.partnerId);
    if (!normalizedPartnerId) throw new Error('partnerId is required');

    const partner = await partnerRepository.findById(normalizedPartnerId);
    if (!partner) throw new Error('Partner not found');
    if (partner.verificationStatus !== 'verified') throw new Error('Partner must be verified');

    // Partners can only create agreements for their own verified partner profile.
    if (user.role === 'partner' && partner.userId.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    if (!data.campaignId) {
      throw new Error('campaignId is required');
    }

    const campaign = await Campaign.findById(data.campaignId);
    if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');

    // Institutional integrity check Hub
    if (user.role === 'ngo-admin') {
      await this._ensureNgoApproved(user.id);
    }

    const status = user.role === 'partner' ? 'pending' : (data.status || 'draft');
    const agreement = await agreementRepository.create({ ...data, partnerId: normalizedPartnerId, status, createdBy: user.id });
    this._recalcPartnerHistory(normalizedPartnerId); // Run in background Hub
    return agreement;
  }

  async getAgreements(filters = {}, user) {
    const query = {};
    if (filters.partnerId) query.partnerId = this._extractPartnerId(filters.partnerId);
    if (filters.campaignId) query.campaignId = filters.campaignId;
    if (filters.status) query.status = filters.status;
    if (filters.agreementType) query.agreementType = filters.agreementType;

    // Enforce isolation while maintaining mission visibility Hub Hub Hub
    if (user.role === 'partner') {
        const partner = await partnerRepository.findByUserId(user.id);
        query.partnerId = partner?._id;
    } else if (user.role === 'ngo-admin') {
        const myCampaigns = await Campaign.find({ createdBy: user.id }).select('_id');
        const campaignIds = myCampaigns.map(c => c._id);
        
        query.$or = [
            { createdBy: user.id },
            { campaignId: { $in: campaignIds } }
        ];
    }

    return await agreementRepository.findAll(query);
  }

  async getAgreementById(id, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    
    // Global Admins see all mission agreements Hub
    if (user.role === 'admin') {
      return agreement;
    }

    // Partners can see agreements assigned to them
    if (user.role === 'partner') {
      const partner = await partnerRepository.findByUserId(user.id);
      if (partner) {
        const partnerIdStr = partner._id.toString();
        const agreementPartnerIdStr = agreement.partnerId?._id?.toString() || agreement.partnerId?.toString();
        if (agreementPartnerIdStr === partnerIdStr) {
          return agreement;
        }
      }
    }

    // All other administrative roles (like ngo-admin) only see their own initialized data Hub
    // However, NGO admins should also see agreements related to their own campaigns
    if (user.role === 'ngo-admin') {
      const campaign = await Campaign.findById(agreement.campaignId);
      if (campaign && campaign.createdBy.toString() === user.id) {
        return agreement;
      }
    }

    if (agreement.createdBy?.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    
    return agreement;
  }

  async updateAgreement(id, data, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');

    let isAuthorized = false;
    if (user.role === 'admin') isAuthorized = true;
    else if (agreement.createdBy.toString() === user.id) isAuthorized = true;
    else if (user.role === 'ngo-admin') {
      const campaign = await Campaign.findById(agreement.campaignId);
      if (campaign && campaign.createdBy.toString() === user.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new Error('Unauthorized');
    }

    if (Object.prototype.hasOwnProperty.call(data, 'campaignId')) {
      if (!data.campaignId) {
        throw new Error('campaignId is required');
      }
      const campaign = await Campaign.findById(data.campaignId);
      if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');
    }

    const updated = await agreementRepository.update(id, data);
    const partnerId = agreement.partnerId?._id || agreement.partnerId;
    this._recalcPartnerHistory(partnerId.toString());
    return updated;
  }

  async deleteAgreement(id, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');

    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    if (agreement.status === 'active') {
      throw new Error('Cannot delete active agreement');
    }

    // Cascade delete milestones
    await import('./milestone.service.js').then(m =>
      m.default.deleteByAgreement(id)
    );

    const partnerId = agreement.partnerId?._id || agreement.partnerId;
    await agreementRepository.delete(id);
    this._recalcPartnerHistory(partnerId);
  }

  async getPartnerAgreements(partnerId, user) {
    const normalizedPartnerId = this._extractPartnerId(partnerId);
    // Admin can see all Hub
    if (user.role === 'admin') {
      return await agreementRepository.findByPartnerId(normalizedPartnerId);
    }
    
    // NGO Admins only see agreements they personally initialized Hub
    if (user.role === 'ngo-admin') {
      const agreements = await agreementRepository.findByPartnerId(normalizedPartnerId);
      return agreements.filter(a => a.createdBy.toString() === user.id);
    }

    // Partners can only see agreements for their own account
    if (user.role === 'partner') {
      const partner = await partnerRepository.findById(partnerId);
      if (!partner || partner.userId.toString() !== user.id) {
        throw new Error('Unauthorized');
      }
      return await agreementRepository.findByPartnerId(partnerId);
    }

    // Other roles cannot access
    throw new Error('Unauthorized');
  }

  async getAgreementsByCampaign(campaignId, user) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');
    
    // Global Admin sees all Hub
    if (user.role === 'admin') {
      return await agreementRepository.findByCampaignId(campaignId);
    }

    // NGO admins see mission agreements if they authorized the mission Hub
    if (user.role === 'ngo-admin') {
      const isOwner = campaign.createdBy.toString() === user.id;
      if (!isOwner) throw new Error('Unauthorized Access Hub');
      return await agreementRepository.findByCampaignId(campaignId);
    }
    
    // Partners see only their own agreements for this campaign
    if (user.role === 'partner') {
      const agreements = await agreementRepository.findByCampaignId(campaignId);
      return agreements.filter(a => a.createdBy.toString() === user.id);
    }
    
    throw new Error('Unauthorized');
  }

  async updateStatus(id, status, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    const validTransitions = {
      draft: ['active', 'cancelled', 'suspended'],
      pending: ['cancelled'],
      active: ['completed', 'cancelled', 'suspended'],
      suspended: ['active', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[agreement.status].includes(status)) {
      throw new Error(`Cannot transition from ${agreement.status} to ${status}`);
    }

    const updated = await agreementRepository.update(id, { status });
    const partnerId = agreement.partnerId?._id || agreement.partnerId;
    this._recalcPartnerHistory(partnerId.toString());
    return updated;
  }

  async approveAgreement(id, user) {
    if (user.role !== 'admin' && user.role !== 'ngo-admin') {
      throw new Error('Unauthorized');
    }

    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    if (agreement.status !== 'pending') {
      throw new Error('Only pending agreements can be approved');
    }

    const updated = await agreementRepository.update(id, {
      status: 'active',
      approvedBy: user.id,
      approvedAt: new Date(),
    });
    const partnerId = agreement.partnerId?._id || agreement.partnerId;
    this._recalcPartnerHistory(partnerId.toString());
    return updated;
  }

  async acceptAgreement(id, user) {
    if (user.role !== 'partner') {
      throw new Error('Unauthorized Hub');
    }

    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');

    const partner = await partnerRepository.findByUserId(user.id);
    if (!partner || (agreement.partnerId?._id?.toString() || agreement.partnerId?.toString()) !== partner._id.toString()) {
        throw new Error('Unauthorized Access Hub');
    }

    const updated = await agreementRepository.update(id, {
      partnerAcceptedBy: user.id,
      partnerAcceptedAt: new Date(),
      status: 'signed'
    });

    // If already approved by admin, we can auto-activate Hub Hub
    if (updated.approvedAt) {
        await agreementRepository.update(id, { status: 'active' });
    }

    this._recalcPartnerHistory(partner._id.toString());
    return updated;
  }

  async _recalcPartnerHistory(partnerId) {
    // Dynamic import to avoid circular dependency
    const { default: partnerService } = await import('./partner.service.js');
    await partnerService.recalculateHistory(partnerId);
  }
}

export default new AgreementService();
