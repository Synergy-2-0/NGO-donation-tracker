import partnerRepository from "../repository/partner.repository.js";

class PartnerService {
    async createPartnership(data,userId){
        return await partnerRepository.create({...data,userId});
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
    return partner;
  }

  async updatePartner(id, data, user) {
    return await partnerRepository.update(id, data);
  }

  async approvePartner(id) {
    const partner = await partnerRepository.approve(id);
    if (!partner) throw new Error('Partner not found');
    return partner;
  }

  async deletePartner(id) {
    const canDelete = await Partner.findById(id).then(p => p?.canDelete?.() ?? false);
    if (!canDelete) throw new Error('Cannot delete: has active agreements');
    return await partnerRepository.softDelete(id);
  }
}



export default new PartnerService();