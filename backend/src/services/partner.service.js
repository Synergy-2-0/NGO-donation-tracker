import partnerRepository from "../repository/partner.repository.js";
import agreementRepository from "../repository/agreement.repository.js";
import emailService from "./email.service.js";
import geocodingService from './geocoding.service.js';

class PartnerService {
  _hasCoordinates(address) {
    return Array.isArray(address?.coordinates?.coordinates) && address.coordinates.coordinates.length === 2;
  }

  // Create new partnership
  async createPartnership(data, userId) {
    if (data.address && !this._hasCoordinates(data.address)) {
      const geocoded = await geocodingService.geocodeAddress(data.address);
      if (!geocoded) {
        throw new Error('Could not geocode partner address. Provide valid coordinates.');
      }
      data.address.coordinates = geocoded;
    }

    return await partnerRepository.create({ ...data, userId });
  }

  // Get partners with institutional isolation Hub
  async getPartners(filters = {}, user) {
    if (!user || user.role === 'donor') {
      return await partnerRepository.findPublic();
    }
    
    // Global Admin sees ALL partners in the registry Hub
    if (user.role === 'admin') {
      return await partnerRepository.findAll(filters);
    }
    
    // NGO Administrators only see:
    // 1. All VERIFIED partners (to browse/invite)
    // 2. ONLY those PENDING partners they themselves initialized Hub
    if (user.role === 'ngo-admin') {
      const allPartners = await partnerRepository.findAll(filters);
      return allPartners.filter(p => 
        p.verificationStatus === 'verified' || 
        p.userId?.toString() === user.id
      );
    }

    return await partnerRepository.findPublic();
  }

  // Get single partner with authorization check
  async getPartnerById(id, user) {
    if (id === 'me') {
      return await this.getPartnerByUserId(user.id);
    }
    
    const partner = await partnerRepository.findById(id);
    if (!partner) throw new Error('Partner not found');
    
    if (!user) {
      if (partner.verificationStatus !== 'verified') throw new Error('Unauthorized');
      return partner;
    }
    
    if (user.role !== 'admin' && user.role !== 'ngo-admin' && partner.userId?.toString() !== user.id && partner.verificationStatus !== 'verified') {
      throw new Error('Unauthorized');
    }
    return partner;
  }

  // Update partner with authorization
  async updatePartner(id, data, user) {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw new Error('Partner not found');
    
    if (user.role !== 'admin' && user.role !== 'ngo-admin' && partner.userId.toString() !== user.id) {
      throw new Error('Unauthorized');
    }

    if (data.address && !this._hasCoordinates(data.address)) {
      const mergedAddress = {
        street: data.address.street || partner.address.street,
        city: data.address.city || partner.address.city,
        state: data.address.state || partner.address.state,
        country: data.address.country || partner.address.country,
        postalCode: data.address.postalCode || partner.address.postalCode,
      };
      const geocoded = await geocodingService.geocodeAddress(mergedAddress);
      if (!geocoded) {
        throw new Error('Could not geocode partner address. Provide valid coordinates.');
      }
      data.address.coordinates = geocoded;
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
    
    if (user.role !== 'admin' && user.role !== 'ngo-admin' && partner.userId.toString() !== user.id) {
      throw new Error('Unauthorized');
    }
    return await partnerRepository.softDelete(id);
  }

  // Recalculate and persist partnershipHistory metrics from actual agreements
  async recalculateHistory(partnerId) {
    const agreements = await agreementRepository.findByPartnerId(partnerId);
    const active = agreements.filter(a => a.status === 'active').length;
    const completed = agreements.filter(a => a.status === 'completed').length;
    const totalContributed = agreements
      .filter(a => ['active', 'completed'].includes(a.status))
      .reduce((sum, a) => sum + (a.totalValue || 0), 0);

    return await partnerRepository.update(partnerId, {
      'partnershipHistory.totalPartnerships': agreements.length,
      'partnershipHistory.activePartnerships': active,
      'partnershipHistory.completedPartnerships': completed,
      'partnershipHistory.totalContributed': totalContributed,
    });
  }

  // Return sanitized public impact data for a verified partner
  async getPartnerImpact(partnerId) {
    const partner = await partnerRepository.findById(partnerId);
    if (!partner) throw new Error('Partner not found');
    if (partner.verificationStatus !== 'verified') throw new Error('Partner not found');

    const agreements = await agreementRepository.findByPartnerId(partnerId);
    const completed = agreements.filter(a => a.status === 'completed');
    const totalValueDelivered = completed.reduce((s, a) => s + (a.totalValue || 0), 0);

    return {
      organizationName: partner.organizationName,
      organizationType: partner.organizationType,
      csrFocus: partner.csrFocus,
      sdgGoals: partner.sdgGoals,
      totalAgreements: partner.partnershipHistory.totalPartnerships,
      activeAgreements: partner.partnershipHistory.activePartnerships,
      completedAgreements: partner.partnershipHistory.completedPartnerships,
      totalContributed: partner.partnershipHistory.totalContributed,
      totalValueDelivered,
    };
  }

  // Get current user's partner profile
  async getPartnerByUserId(userId) {
    const partner = await partnerRepository.findByUserId(userId);
    if (!partner) throw new Error('Partner profile not found');
    return partner;
  }
}

export default new PartnerService();