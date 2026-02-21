import agreementRepository from '../repository/agreement.repository.js';
import partnerRepository from '../repository/partner.repository.js';

class AgreementService {
  async createAgreement(data, userId) {
    const partner = await partnerRepository.findById(data.partnerId);
    if (!partner) throw new Error('Partner not found');
    if (partner.verificationStatus !== 'verified') throw new Error('Partner must be verified');
    
    return await agreementRepository.create({ ...data, createdBy: userId });
  }

  async getAgreements(filters = {}, user) {
    if (user.role === 'admin') {
      return await agreementRepository.findAll(filters);
    }
    return await agreementRepository.findAll({ ...filters, createdBy: user.id });
  }

  async getAgreementById(id, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    
    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    return agreement;
  }

  async updateAgreement(id, data, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    
    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    return await agreementRepository.update(id, data);
  }

  async deleteAgreement(id, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    
    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    if (agreement.status === 'active') {
      throw new Error('Cannot delete active agreement');
    }
    return await agreementRepository.delete(id);
  }

  async getPartnerAgreements(partnerId) {
    return await agreementRepository.findByPartnerId(partnerId);
  }
}

export default new AgreementService();
