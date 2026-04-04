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

    const campaignId = data.campaignId || (agreement.campaignId?._id || agreement.campaignId)?.toString();
    if (!campaignId) throw new Error('A campaign mission linkage is required to create a milestone.');

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.isDeleted) throw new Error('Campaign not found');

    if (agreement.campaignId && (agreement.campaignId?._id || agreement.campaignId).toString() !== campaignId) {
      throw new Error('Milestone mission must match the agreement mission.');
    }

    return await milestoneRepository.create({ ...data, campaignId, createdBy: user.id });
  }

  async getMilestones({ agreementId, campaignId }, user) {
    const filters = {};

    if (agreementId) {
      filters.agreementId = agreementId;
    } else if (campaignId) {
      filters.campaignId = campaignId;
    }

    // Role-based scoping
    if (user.role === 'partner') {
      // If no specific agreement/campaign requested, filter by createdBy to see their own records
      // Or find all their agreements and filter (simpler check: createdBy if they managed the milestones)
      if (!agreementId && !campaignId) {
        filters.createdBy = user.id;
      }
    } else if (!['admin', 'ngo-admin'].includes(user.role)) {
       // Regular donors shouldn't see all milestones without a specific campaign context
       if (!campaignId && !agreementId) {
         throw new Error('Mission context is required for this action.');
       }
    }

    return await milestoneRepository.findAll(filters);
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

    if (nextAgreementId) {
      const agreement = await agreementRepository.findById(nextAgreementId);
      if (agreement && nextCampaignId) {
        if (agreement.campaignId && (agreement.campaignId?._id || agreement.campaignId).toString() !== nextCampaignId) {
           throw new Error('Milestone mission must match the agreement mission.');
        }
      }
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
