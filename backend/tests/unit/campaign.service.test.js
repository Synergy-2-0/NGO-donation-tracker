import { jest, expect, describe, it, beforeEach } from '@jest/globals';

const campaignRepoMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  updateById: jest.fn(),
  updateMany: jest.fn(),
};

const ngoRepoMock = {
  findByUserId: jest.fn(),
  findAll: jest.fn(),
};

// Mock User model to avoid CastError
const userRepoMock = {
    findById: jest.fn(),
};

jest.unstable_mockModule('../../src/repository/campaign.repository.js', () => ({
  __esModule: true,
  ...campaignRepoMock,
  create: campaignRepoMock.create,
  findAll: campaignRepoMock.findAll,
  findById: campaignRepoMock.findById,
  updateById: campaignRepoMock.updateById,
  updateMany: campaignRepoMock.updateMany,
}));

jest.unstable_mockModule('../../src/repository/ngo.repository.js', () => ({
  __esModule: true,
  ...ngoRepoMock,
  findByUserId: ngoRepoMock.findByUserId,
  findAll: ngoRepoMock.findAll,
}));

// We must also mock the internal User model fetch in service if it's there
jest.unstable_mockModule('../../src/models/user.model.js', () => ({
    default: {
        findById: jest.fn()
    }
}));

const campaignService = await import('../../src/services/campaign.service.js');

describe('Campaign Service Unit Tests', () => {
  const VALID_ID = '507f1f77bcf86cd799439011';
  const OTHER_ID = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCampaign', () => {
    it('should create a campaign if data is valid', async () => {
      const data = { title: 'Test Campaign', goalAmount: 1000, createdBy: VALID_ID };
      campaignRepoMock.create.mockResolvedValue({ ...data, _id: VALID_ID });

      const result = await campaignService.createCampaign(data);

      expect(campaignRepoMock.create).toHaveBeenCalled();
      expect(result._id).toBe(VALID_ID);
    });

    it('should throw error if title or goalAmount is missing', async () => {
      await expect(campaignService.createCampaign({ title: 'Test' }))
        .rejects.toThrow('Title and goal amount are required');
    });
  });

  describe('getCampaignById', () => {
    it('should return campaign with NGO details', async () => {
      const campId = VALID_ID;
      const mockCampaign = { 
        _id: campId, 
        title: 'Test', 
        createdBy: OTHER_ID,
        toObject: jest.fn().mockReturnValue({ _id: campId, title: 'Test', createdBy: OTHER_ID })
      };
      const mockNgo = { _id: 'ngo123', organizationName: 'Test NGO', userId: OTHER_ID };

      campaignRepoMock.findById.mockResolvedValue(mockCampaign);
      ngoRepoMock.findByUserId.mockResolvedValue(mockNgo);

      const result = await campaignService.getCampaignById(campId);

      expect(campaignRepoMock.findById).toHaveBeenCalledWith(campId);
      expect(result.createdBy.organizationName).toBe('Test NGO');
    });
  });
});
