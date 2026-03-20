import Partnership from "../models/partner.model.js";

class PartnerRepository {
  // Create new partner
  async create(data) {
    return await Partnership.create(data);
  }

  // Find all partners with filters
  async findAll(filters = {}) {
    return await Partnership.find(filters).sort({ createdAt: -1 });
  }

  // Find partner by ID
  async findById(id) {
    return await Partnership.findById(id);
  }

  // Update partner
  async update(id, data) {
    return await Partnership.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  // Approve partner verification
  async approve(id, adminId) {
    return await Partnership.findByIdAndUpdate(
      id,
      { verificationStatus: 'verified', verifiedAt: new Date(), verifiedBy: adminId },
      { new: true }
    );
  }

  // Soft delete by setting status to inactive
  async softDelete(id) {
    return await Partnership.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
  }

  // Find only verified and active partners
  async findPublic() {
    return await Partnership.find({ verificationStatus: 'verified', status: 'active' }).sort({ createdAt: -1 });
  }

  // Find partner by user ID
  async findByUserId(userId) {
    return await Partnership.findOne({ userId });
  }
}

export default new PartnerRepository();