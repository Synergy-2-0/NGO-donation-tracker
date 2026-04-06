import * as donorService from '../../src/services/donor.service.js';
import * as donorRepo from '../../src/repository/donor.repository.js';

jest.mock('../../src/repository/donor.repository.js');

describe('Donor Service Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDonorProfile', () => {
    it('should create a donor profile if one does not exist', async () => {
      const userId = 'user123';
      const data = { organizationName: 'Test Donor' };
      donorRepo.findByUserId.mockResolvedValue(null);
      donorRepo.create.mockResolvedValue({ ...data, userId, _id: 'donor123' });

      const result = await donorService.createDonorProfile(data, userId);

      expect(donorRepo.findByUserId).toHaveBeenCalledWith(userId);
      expect(donorRepo.create).toHaveBeenCalledWith({ ...data, userId });
      expect(result._id).toBe('donor123');
    });

    it('should throw error if donor profile already exists', async () => {
      const userId = 'user123';
      donorRepo.findByUserId.mockResolvedValue({ _id: 'existingDonor' });

      await expect(donorService.createDonorProfile({}, userId))
        .rejects.toThrow('Donor profile already exists for this user');
    });
  });

  describe('getDonorById', () => {
    it('should return donor if found', async () => {
      const donorId = 'donor123';
      const mockDonor = { _id: donorId, organizationName: 'Test' };
      donorRepo.findById.mockResolvedValue(mockDonor);

      const result = await donorService.getDonorById(donorId);

      expect(result).toEqual(mockDonor);
    });

    it('should throw error if donor not found', async () => {
      donorRepo.findById.mockResolvedValue(null);
      await expect(donorService.getDonorById('nonexistent'))
        .rejects.toThrow('Donor not found');
    });
  });

  describe('createPledge', () => {
    it('should add a pledge and return updated donor', async () => {
      const donorId = 'donor123';
      const pledgeData = { amount: 1000, frequency: 'monthly' };
      const mockDonor = { _id: donorId, userId: { email: 'test@donor.com', name: 'John' } };
      
      donorRepo.findById.mockResolvedValue(mockDonor);
      donorRepo.addPledge.mockResolvedValue({ ...mockDonor, pledges: [pledgeData] });

      const result = await donorService.createPledge(donorId, pledgeData);

      expect(donorRepo.addPledge).toHaveBeenCalledWith(donorId, pledgeData);
      expect(result.pledges).toHaveLength(1);
    });
  });
});
