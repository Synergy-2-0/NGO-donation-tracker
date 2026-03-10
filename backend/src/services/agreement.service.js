import agreementRepository from '../repository/agreement.repository.js';
import partnerRepository from '../repository/partner.repository.js';
import Campaign from '../models/campaign.model.js';

class AgreementService {
  async createAgreement(data, userId) {
    const partner = await partnerRepository.findById(data.partnerId);
    if (!partner) throw new Error('Partner not found');
    if (partner.verificationStatus !== 'verified') throw new Error('Partner must be verified');

    if (data.campaignId) {
      const campaign = await Campaign.findById(data.campaignId);
      if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');
    }

    const agreement = await agreementRepository.create({ ...data, createdBy: userId });
    await this._recalcPartnerHistory(data.partnerId);
    return agreement;
  }

  async getAgreements(filters = {}, user) {
    const query = {};
    if (filters.partnerId) query.partnerId = filters.partnerId;
    if (filters.campaignId) query.campaignId = filters.campaignId;
    if (filters.status) query.status = filters.status;
    if (filters.agreementType) query.agreementType = filters.agreementType;

    if (user.role !== 'admin') {
      query.createdBy = user.id;
    }

    return await agreementRepository.findAll(query);
  }

  async getAgreementById(id, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    
    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    return agreement;
  }

  async updateAgreement(id, data, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');

    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    if (data.campaignId) {
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

    const partnerId = agreement.partnerId.toString();
    await agreementRepository.delete(id);
    await this._recalcPartnerHistory(partnerId);
  }

  async getPartnerAgreements(partnerId) {
    return await agreementRepository.findByPartnerId(partnerId);
  }

  async getAgreementsByCampaign(campaignId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');
    return await agreementRepository.findByCampaignId(campaignId);
  }

  async updateStatus(id, status, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    const validTransitions = {
      draft: ['active', 'cancelled'],
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

  async _recalcPartnerHistory(partnerId) {
    // Dynamic import to avoid circular dependency
    const { default: partnerService } = await import('./partner.service.js');
    await partnerService.recalculateHistory(partnerId);
  }
}

export default new AgreementService();
