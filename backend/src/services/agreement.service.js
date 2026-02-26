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
    
    // Cascade delete milestones
    await import('./milestone.service.js').then(m => 
      m.default.deleteByAgreement(id)
    );
    
    return await agreementRepository.delete(id);
  }

  async getPartnerAgreements(partnerId) {
    return await agreementRepository.findByPartnerId(partnerId);
  }

  async updateStatus(id, status, user) {
    const agreement = await agreementRepository.findById(id);
    if (!agreement) throw new Error('Agreement not found');
    if (user.role !== 'admin' && agreement.createdBy.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    const validTransitions = {
      draft: ['active', 'cancelled'],
      active: ['completed', 'cancelled', 'suspended'],
      suspended: ['active', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[agreement.status].includes(status)) {
      throw new Error(`Cannot transition from ${agreement.status} to ${status}`);
    }

    return await agreementRepository.update(id, { status });
  }
}

export default new AgreementService();
