import milestoneRepository from '../repository/milestone.repository.js';
import agreementRepository from '../repository/agreement.repository.js';
import Campaign from '../models/campaign.model.js';

class MilestoneService {
  async createMilestone(data, user) {
    const agreement = await agreementRepository.findById(data.agreementId);
    if (!agreement) throw new Error('Agreement not found');
    if (agreement.status === 'completed' || agreement.status === 'cancelled') {
      throw new Error('Cannot add milestone to completed/cancelled agreement');
    }

    const campaign = await Campaign.findById(data.campaignId);
    if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');

    if (!agreement.campaignId) {
      throw new Error('Agreement is not linked to a campaign');
    }
    if (agreement.campaignId.toString() !== data.campaignId) {
      throw new Error('Milestone campaignId must match agreement campaignId');
    }

    return await milestoneRepository.create({ ...data, createdBy: user.id });
  }

  async getMilestones({ agreementId, campaignId }, user) {
    if (!agreementId && !campaignId) {
      throw new Error('agreementId or campaignId query parameter is required');
    }

    if (agreementId) {
      const agreement = await agreementRepository.findById(agreementId);
      if (!agreement) throw new Error('Agreement not found');
      
      // Admin/ngo-admin: see all milestones for this agreement
      // Partner/creator: see if they created or are assigned to this agreement
      if (['admin', 'ngo-admin'].includes(user.role)) {
        return await milestoneRepository.findByAgreement(agreementId);
      }
      
      // For now, allow authenticated users (can further restrict to agreement creator later)
      return await milestoneRepository.findByAgreement(agreementId);
    }

    return await milestoneRepository.findByCampaign(campaignId);
  }

  async getMilestoneById(id, user) {
    const milestone = await milestoneRepository.findById(id);
    if (!milestone) throw new Error('Milestone not found');
    
    // Admin/ngo-admin can see any milestone
    if (['admin', 'ngo-admin'].includes(user.role)) {
      return milestone;
    }
    
    // For now, allow authenticated users to view
    return milestone;
  }

  async updateMilestone(id, data, user) {
    const existing = await milestoneRepository.findById(id);
    if (!existing) throw new Error('Milestone not found');

    const nextAgreementId = data.agreementId || existing.agreementId?._id?.toString() || existing.agreementId.toString();
    const nextCampaignId = data.campaignId || existing.campaignId?._id?.toString() || existing.campaignId.toString();

    const agreement = await agreementRepository.findById(nextAgreementId);
    if (!agreement) throw new Error('Agreement not found');

    const campaign = await Campaign.findById(nextCampaignId);
    if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');

    if (!agreement.campaignId || agreement.campaignId.toString() !== nextCampaignId) {
      throw new Error('Milestone campaignId must match agreement campaignId');
    }

    if (user.role !== 'admin' && user.role !== 'ngo-admin' && existing.createdBy?.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    if (data.status === 'completed' && !data.completedAt) {
      data.completedAt = new Date();
    }

    const updated = await milestoneRepository.update(id, data);
    if (!updated) throw new Error('Milestone not found');
    return updated;
  }

  async deleteMilestone(id, user) {
    const existing = await milestoneRepository.findById(id);
    if (!existing) throw new Error('Milestone not found');

    if (user.role !== 'admin' && user.role !== 'ngo-admin' && existing.createdBy?.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    return await milestoneRepository.delete(id);
  }

  async deleteByAgreement(agreementId) {
    const milestones = await milestoneRepository.findByAgreement(agreementId);
    for (const milestone of milestones) {
      await milestoneRepository.delete(milestone._id);
    }
  }
}

export default new MilestoneService();
