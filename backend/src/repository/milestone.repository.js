import Milestone from '../models/milestone.model.js';

class MilestoneRepository {
  async create(data) {
    return await Milestone.create(data);
  }

  async findAll(filters = {}) {
    return await Milestone.find(filters)
      .populate('agreementId', 'title status campaignId')
      .populate('campaignId', 'title status')
      .sort({ dueDate: 1 });
  }

  async findById(id) {
    return await Milestone.findById(id)
      .populate('agreementId', 'title status campaignId')
      .populate('campaignId', 'title status');
  }

  async findByAgreement(agreementId) {
    return await Milestone.find({ agreementId })
      .populate('agreementId', 'title status campaignId')
      .populate('campaignId', 'title status')
      .sort({ dueDate: 1 });
  }

  async findByCampaign(campaignId) {
    return await Milestone.find({ campaignId })
      .populate('agreementId', 'title status campaignId')
      .populate('campaignId', 'title status')
      .sort({ dueDate: 1 });
  }

  async update(id, data) {
    return await Milestone.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('agreementId', 'title status campaignId')
      .populate('campaignId', 'title status');
  }

  async delete(id) {
    return await Milestone.findByIdAndDelete(id);
  }
}

export default new MilestoneRepository();
