import milestoneRepository from '../repository/milestone.repository.js';
import agreementRepository from '../repository/agreement.repository.js';

class MilestoneService {
  async createMilestone(data) {
    const agreement = await agreementRepository.findById(data.agreementId);
    if (!agreement) throw new Error('Agreement not found');
    if (agreement.status === 'completed' || agreement.status === 'cancelled') {
      throw new Error('Cannot add milestone to completed/cancelled agreement');
    }
    return await milestoneRepository.create(data);
  }

  async getMilestones(agreementId) {
    return await milestoneRepository.findByAgreement(agreementId);
  }

  async getMilestoneById(id) {
    const milestone = await milestoneRepository.findById(id);
    if (!milestone) throw new Error('Milestone not found');
    return milestone;
  }

  async updateMilestone(id, data) {
    if (data.status === 'completed' && !data.completedAt) {
      data.completedAt = new Date();
    }
    return await milestoneRepository.update(id, data);
  }

  async deleteMilestone(id) {
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
