import Agreement from '../models/agreement.model.js';

class AgreementRepository {
  async create(data) {
    return await Agreement.create(data);
  }

  async findAll(filters = {}) {
    return await Agreement.find(filters).populate('partnerId', 'organizationName').sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Agreement.findById(id).populate('partnerId', 'organizationName organizationType');
  }

  async findByPartnerId(partnerId) {
    return await Agreement.find({ partnerId }).sort({ createdAt: -1 });
  }

  async update(id, data) {
    return await Agreement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Agreement.findByIdAndDelete(id);
  }

  async countByPartner(partnerId) {
    return await Agreement.countDocuments({ partnerId, status: { $in: ['active', 'completed'] } });
  }
}

export default new AgreementRepository();
