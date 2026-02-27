import Milestone from '../models/milestone.model.js';

class MilestoneRepository {
  async create(data) {
    return await Milestone.create(data);
  }

  async findAll(filters = {}) {
    return await Milestone.find(filters).sort({ dueDate: 1 });
  }

  async findById(id) {
    return await Milestone.findById(id);
  }

  async findByAgreement(agreementId) {
    return await Milestone.find({ agreementId }).sort({ dueDate: 1 });
  }

  async update(id, data) {
    return await Milestone.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Milestone.findByIdAndDelete(id);
  }
}

export default new MilestoneRepository();
