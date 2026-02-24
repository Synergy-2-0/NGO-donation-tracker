import partnerRepository from "../repository/partner.repository.js";
import emailService from "./email.service.js";

class PartnerService {
  async createPartnership(data, userId) {
    if (data.address && !data.address.coordinates) {
      data.address.coordinates = await geocodingService.geocodeAddress(data.address);
    }
    return await partnerRepository.create({ ...data, userId });
  }

  async getPartners(filters = {}, isAdmin = false) {
    if (!isAdmin) {
      return await partnerRepository.findPublic();
    }
    return await partnerRepository.findAll(filters);
  }

  async getPartnerById(id, user) {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw new Error('Partner not found');
    
    if (user.role !== 'admin' && partner.userId.toString() !== user.id && partner.verificationStatus !== 'verified') {
      throw new Error('Unauthorized');
    }
    return partner;
  }

  async updatePartner(id, data, user) {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw new Error('Partner not found');
    
    if (user.role !== 'admin' && partner.userId.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

 
    return await partnerRepository.update(id, data);
  }

  async approvePartner(id, adminId) {
    const partner = await partnerRepository.approve(id, adminId);
    if (!partner) throw new Error('Partner not found');
    
    // Send approval email
    await emailService.sendPartnerApproval(partner, partner.contactPerson.email);
    
    return partner;
  }

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