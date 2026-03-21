import { jest } from '@jest/globals';

const partnerRepositoryMock = {
  create: jest.fn(),
  findPublic: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  approve: jest.fn(),
  softDelete: jest.fn(),
};

const agreementRepositoryMock = {
  findByPartnerId: jest.fn(),
};

const emailServiceMock = {
  sendPartnerApproval: jest.fn(),
};

const geocodingServiceMock = {
  geocodeAddress: jest.fn(),
};

jest.unstable_mockModule('../../src/repository/partner.repository.js', () => ({
  default: partnerRepositoryMock,
}));

jest.unstable_mockModule('../../src/repository/agreement.repository.js', () => ({
  default: agreementRepositoryMock,
}));

jest.unstable_mockModule('../../src/services/email.service.js', () => ({
  default: emailServiceMock,
}));

jest.unstable_mockModule('../../src/services/geocoding.service.js', () => ({
  default: geocodingServiceMock,
}));

const { default: partnerService } = await import('../../src/services/partner.service.js');

const buildBasePartnerData = () => ({
  organizationName: 'Org',
  address: {
    street: 'Street',
    city: 'Colombo',
    state: 'Western',
    country: 'Sri Lanka',
    postalCode: '00100',
  },
});

describe('Partner Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createPartnership geocodes address when coordinates are missing', async () => {
    geocodingServiceMock.geocodeAddress.mockResolvedValue({ type: 'Point', coordinates: [79.8, 6.9] });
    partnerRepositoryMock.create.mockResolvedValue({ _id: '1' });

    await partnerService.createPartnership(buildBasePartnerData(), 'user-1');

    expect(geocodingServiceMock.geocodeAddress).toHaveBeenCalled();
    expect(partnerRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        address: expect.objectContaining({
          coordinates: { type: 'Point', coordinates: [79.8, 6.9] },
        }),
      })
    );
  });

  test('createPartnership throws when geocoding fails', async () => {
    geocodingServiceMock.geocodeAddress.mockResolvedValue(null);

    await expect(partnerService.createPartnership(buildBasePartnerData(), 'user-1')).rejects.toThrow(
      'Could not geocode partner address. Provide valid coordinates.'
    );
    expect(partnerRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('getPartners returns public list for non-admin', async () => {
    partnerRepositoryMock.findPublic.mockResolvedValue([{ _id: 'p1' }]);

    const result = await partnerService.getPartners({}, false);

    expect(partnerRepositoryMock.findPublic).toHaveBeenCalled();
    expect(partnerRepositoryMock.findAll).not.toHaveBeenCalled();
    expect(result).toEqual([{ _id: 'p1' }]);
  });

  test('getPartners returns full list for admin', async () => {
    partnerRepositoryMock.findAll.mockResolvedValue([{ _id: 'p2' }]);

    const result = await partnerService.getPartners({ status: 'active' }, true);

    expect(partnerRepositoryMock.findAll).toHaveBeenCalledWith({ status: 'active' });
    expect(result).toEqual([{ _id: 'p2' }]);
  });

  test('approvePartner sends approval email', async () => {
    const partner = {
      _id: 'p3',
      organizationName: 'Acme',
      contactPerson: { email: 'owner@example.com' },
    };
    partnerRepositoryMock.approve.mockResolvedValue(partner);

    const result = await partnerService.approvePartner('p3', 'admin-1');

    expect(emailServiceMock.sendPartnerApproval).toHaveBeenCalledWith(partner, 'owner@example.com');
    expect(result).toBe(partner);
  });

  test('approvePartner throws not found if repository returns null', async () => {
    partnerRepositoryMock.approve.mockResolvedValue(null);

    await expect(partnerService.approvePartner('missing', 'admin-1')).rejects.toThrow('Partner not found');
  });

  test('deletePartner throws unauthorized for non-owner non-admin', async () => {
    partnerRepositoryMock.findById.mockResolvedValue({ userId: { toString: () => 'owner-1' } });

    await expect(
      partnerService.deletePartner('p4', { role: 'partner', id: 'other-user' })
    ).rejects.toThrow('Unauthorized');
  });

  test('getPartnerImpact hides unverified partner as not found', async () => {
    partnerRepositoryMock.findById.mockResolvedValue({ verificationStatus: 'pending' });

    await expect(partnerService.getPartnerImpact('p5')).rejects.toThrow('Partner not found');
  });

  test('getPartnerImpact returns computed values for verified partner', async () => {
    partnerRepositoryMock.findById.mockResolvedValue({
      organizationName: 'Acme',
      organizationType: 'foundation',
      csrFocus: ['education'],
      sdgGoals: [4],
      verificationStatus: 'verified',
      partnershipHistory: {
        totalPartnerships: 2,
        activePartnerships: 1,
        completedPartnerships: 1,
        totalContributed: 3000,
      },
    });
    agreementRepositoryMock.findByPartnerId.mockResolvedValue([
      { status: 'completed', totalValue: 1000 },
      { status: 'active', totalValue: 2000 },
    ]);

    const result = await partnerService.getPartnerImpact('p6');

    expect(result.organizationName).toBe('Acme');
    expect(result.totalValueDelivered).toBe(1000);
    expect(result.totalContributed).toBe(3000);
  });
});
