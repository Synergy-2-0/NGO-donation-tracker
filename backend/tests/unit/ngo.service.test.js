import { jest, expect, describe, it, beforeEach } from '@jest/globals';

const ngoRepoMock = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
};

const userModelMock = {
  findByIdAndUpdate: jest.fn(),
};

const campaignModelMock = {
  find: jest.fn(),
};

jest.unstable_mockModule('../../src/repository/ngo.repository.js', () => ({
  __esModule: true,
  ...ngoRepoMock,
  findByUserId: ngoRepoMock.findByUserId,
  create: ngoRepoMock.create,
  update: ngoRepoMock.update,
  findAll: ngoRepoMock.findAll,
  findById: ngoRepoMock.findById,
}));

jest.unstable_mockModule('../../src/models/user.model.js', () => ({
  default: userModelMock,
}));

jest.unstable_mockModule('../../src/models/campaign.model.js', () => ({
  default: campaignModelMock,
}));

const ngoService = await import('../../src/services/ngo.service.js');

describe('NGO Service Unit Tests', () => {
  const VALID_ID = '507f1f77bcf86cd799439011';
  const OTHER_ID = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerNGO', () => {
    it('should register an NGO if one does not exist for the user', async () => {
      const userId = VALID_ID;
      const data = { organizationName: 'Test NGO' };
      ngoRepoMock.findByUserId.mockResolvedValue(null);
      ngoRepoMock.create.mockResolvedValue({ ...data, userId, _id: OTHER_ID });
      userModelMock.findByIdAndUpdate.mockResolvedValue({});

      const result = await ngoService.registerNGO(userId, data);

      expect(ngoRepoMock.findByUserId).toHaveBeenCalledWith(userId);
      expect(ngoRepoMock.create).toHaveBeenCalledWith({ ...data, userId });
      expect(userModelMock.findByIdAndUpdate).toHaveBeenCalledWith(userId, { role: 'ngo-admin' });
      expect(result._id).toBe(OTHER_ID);
    });

    it('should throw error if NGO profile already exists', async () => {
      ngoRepoMock.findByUserId.mockResolvedValue({ _id: 'exists' });
      await expect(ngoService.registerNGO(VALID_ID, {}))
        .rejects.toThrow('User already has an NGO profile');
    });
  });

  describe('calculateTrustScore', () => {
    it('should calculate trust score based on NGO metrics', async () => {
      const ngoId = VALID_ID;
      const mockNgo = { 
        _id: ngoId, 
        verificationDocuments: ['file1'], 
        totalFundsRaised: 150000, 
        totalBeneficiaries: 200 
      };
      
      ngoRepoMock.findById.mockResolvedValue(mockNgo);
      ngoRepoMock.update.mockImplementation((id, data) => Promise.resolve({ ...mockNgo, ...data }));

      const result = await ngoService.calculateTrustScore(ngoId);

      // 50 (base) + 20 (docs) + 10 (raised) + 10 (beneficiaries) = 90
      expect(result.trustScore).toBe(90);
    });
  });
});
