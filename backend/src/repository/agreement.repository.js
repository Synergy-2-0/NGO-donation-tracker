import Agreement from '../models/agreement.model.js';
import mongoose from 'mongoose';

class AgreementRepository {
  async create(data) {
    return await Agreement.create(data);
  }

  async findAll(filters = {}) {
    return await Agreement.find(filters)
      .populate('partnerId', 'organizationName')
      .populate('campaignId', 'title status')
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Agreement.findById(id)
      .populate('partnerId', 'organizationName organizationType')
      .populate('campaignId', 'title goalAmount status');
  }

  async findByPartnerId(partnerId) {
    return await Agreement.find({ partnerId })
      .populate('campaignId', 'title status')
      .sort({ createdAt: -1 });
  }

  async findByCampaignId(campaignId) {
    return await Agreement.find({ campaignId })
      .populate('partnerId', 'organizationName')
      .sort({ createdAt: -1 });
  }

  async getStatsByPartner(partnerId) {
    return await Agreement.aggregate([
      { $match: { partnerId: new mongoose.Types.ObjectId(partnerId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalValue' }
        }
      }
    ]);
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
