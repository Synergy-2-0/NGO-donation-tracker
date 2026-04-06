import { jest, expect, describe, it, beforeEach } from '@jest/globals';

const donorRepoMock = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  addPledge: jest.fn(),
};

jest.unstable_mockModule('../../src/repository/donor.repository.js', () => ({
  __esModule: true,
  ...donorRepoMock,
  findByUserId: donorRepoMock.findByUserId,
  create: donorRepoMock.create,
  findById: donorRepoMock.findById,
  addPledge: donorRepoMock.addPledge,
}));

const donorService = await import('../../src/services/donor.service.js');

describe('Donor Service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDonorProfile', () => {
    it('should create a donor profile if one does not exist', async () => {
      const userId = 'user123';
      const data = { organizationName: 'Test Donor' };
      donorRepoMock.findByUserId.mockResolvedValue(null);
      donorRepoMock.create.mockResolvedValue({ ...data, userId, _id: 'donor123' });

      const result = await donorService.createDonorProfile(data, userId);

      expect(donorRepoMock.findByUserId).toHaveBeenCalledWith(userId);
      expect(donorRepoMock.create).toHaveBeenCalledWith({ ...data, userId });
      expect(result._id).toBe('donor123');
    });

    it('should throw error if donor profile already exists', async () => {
      const userId = 'user123';
      donorRepoMock.findByUserId.mockResolvedValue({ _id: 'existingDonor' });

      await expect(donorService.createDonorProfile({}, userId))
        .rejects.toThrow('Donor profile already exists for this user');
    });
  });

  describe('getDonorById', () => {
    it('should return donor if found', async () => {
      const donorId = 'donor123';
      const mockDonor = { _id: donorId, organizationName: 'Test' };
      donorRepoMock.findById.mockResolvedValue(mockDonor);

      const result = await donorService.getDonorById(donorId);

      expect(result).toEqual(mockDonor);
    });

    it('should throw error if donor not found', async () => {
      donorRepoMock.findById.mockResolvedValue(null);
      await expect(donorService.getDonorById('nonexistent'))
        .rejects.toThrow('Donor not found');
    });
  });
});
