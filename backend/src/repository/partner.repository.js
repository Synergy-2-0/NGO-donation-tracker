import Partnership from "../models/partner.model.js";

class PartnerRepository {
  async create(data) {
    return await Partnership.create(data);
  }

  async findAll(filters = {}) {
    return await Partnership.find(filters).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Partnership.findById(id);
  }

  async update(id, data) {
    return await Partnership.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async approve(id, adminId) {
    return await Partnership.findByIdAndUpdate(
      id,
      { verificationStatus: 'verified', verifiedAt: new Date(), verifiedBy: adminId },
      { new: true }
    );
  }

  async softDelete(id) {
    return await Partnership.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  }

  async findPublic() {
    return await Partnership.find({ verificationStatus: 'verified', status: 'active' }).sort({ createdAt: -1 });
  }
}

export default new PartnerRepository();