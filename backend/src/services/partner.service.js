import partnerRepository from "../repository/partner.repository.js";
import emailService from "./email.service.js";

class PartnerService {
  // Create new partnership
  async createPartnership(data, userId) {
    return await partnerRepository.create({ ...data, userId });
  }

  // Get partners with role-based filtering
  async getPartners(filters = {}, isAdmin = false) {
    if (!isAdmin) {
      return await partnerRepository.findPublic();
    }
    return await partnerRepository.findAll(filters);
  }

  // Get single partner with authorization check
  async getPartnerById(id, user) {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw new Error('Partner not found');
    
    if (user.role !== 'admin' && partner.userId.toString() !== user.id && partner.verificationStatus !== 'verified') {
      throw new Error('Unauthorized');
    }
    return partner;
  }

  // Update partner with authorization
  async updatePartner(id, data, user) {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw new Error('Partner not found');
    
    if (user.role !== 'admin' && partner.userId.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

 
    return await partnerRepository.update(id, data);
  }

  // Approve partner and send notification
  async approvePartner(id, adminId) {
    const partner = await partnerRepository.approve(id, adminId);
    if (!partner) throw new Error('Partner not found');
    
    await emailService.sendPartnerApproval(partner, partner.contactPerson.email);
    
    return partner;
  }

  // Soft delete partner
  async deletePartner(id, user) {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw new Error('Partner not found');
    
    if (user.role !== 'admin' && partner.userId.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    return await partnerRepository.softDelete(id);
  }
}

export default new PartnerService();