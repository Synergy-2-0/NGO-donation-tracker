import agreementRepository from '../repository/agreement.repository.js';
import partnerRepository from '../repository/partner.repository.js';
import Campaign from '../models/campaign.model.js';

class AgreementService {
  async createAgreement(data, user) {
    const partner = await partnerRepository.findById(data.partnerId);
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

    const status = user.role === 'partner' ? 'pending' : (data.status || 'draft');
    const agreement = await agreementRepository.create({ ...data, status, createdBy: user.id });
    await this._recalcPartnerHistory(data.partnerId);
    return agreement;
  }

  async getAgreements(filters = {}, user) {
    const query = {};
    if (filters.partnerId) query.partnerId = filters.partnerId;
    if (filters.campaignId) query.campaignId = filters.campaignId;
    if (filters.status) query.status = filters.status;
    if (filters.agreementType) query.agreementType = filters.agreementType;

    if (!['admin', 'ngo-admin'].includes(user.role)) {
      query.createdBy = user.id;
    }

    return await agreementRepository.findAll(query);
  }

  async getAgreementById(id, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    
    if (!['admin', 'ngo-admin'].includes(user.role) && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    return agreement;
  }

  async updateAgreement(id, data, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');

    if (!['admin', 'ngo-admin'].includes(user.role) && agreement.createdBy.toString() !== user.id) {
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
    await this._recalcPartnerHistory(agreement.partnerId.toString());
    return updated;
  }

  async deleteAgreement(id, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');

    if (!['admin', 'ngo-admin'].includes(user.role) && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    if (agreement.status === 'active') {
      throw new Error('Cannot delete active agreement');
    }

    // Cascade delete milestones
    await import('./milestone.service.js').then(m =>
      m.default.deleteByAgreement(id)
    );

    const partnerId = agreement.partnerId.toString();
    await agreementRepository.delete(id);
    await this._recalcPartnerHistory(partnerId);
  }

  async getPartnerAgreements(partnerId, user) {
    // Admin/ngo-admin can see all agreements for a partner
    if (['admin', 'ngo-admin'].includes(user.role)) {
      return await agreementRepository.findByPartnerId(partnerId);
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
    
    // Admin/ngo-admin see all agreements for the campaign
    if (user.role === 'admin' || user.role === 'ngo-admin') {
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
    if (!['admin', 'ngo-admin'].includes(user.role) && agreement.createdBy.toString() !== user.id) {
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
    await this._recalcPartnerHistory(agreement.partnerId.toString());
    return updated;
  }

  async approveAgreement(id, user) {
    if (!['admin', 'ngo-admin'].includes(user.role)) {
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
    await this._recalcPartnerHistory(agreement.partnerId.toString());
    return updated;
  }

  async _recalcPartnerHistory(partnerId) {
    // Dynamic import to avoid circular dependency
    const { default: partnerService } = await import('./partner.service.js');
    await partnerService.recalculateHistory(partnerId);
  }
}

export default new AgreementService();
