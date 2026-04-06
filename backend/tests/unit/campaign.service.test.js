import * as campaignService from '../../src/services/campaign.service.js';
import * as campaignRepository from '../../src/repository/campaign.repository.js';
import * as ngoRepository from '../../src/repository/ngo.repository.js';
import User from '../../src/models/user.model.js';

jest.mock('../../src/repository/campaign.repository.js');
jest.mock('../../src/repository/ngo.repository.js');
jest.mock('../../src/models/user.model.js');

describe('Campaign Service Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCampaign', () => {
    it('should create a campaign if data is valid', async () => {
      const data = { title: 'Test Campaign', goalAmount: 1000, createdBy: 'admin123' };
      User.findById.mockResolvedValue({ _id: 'admin123', role: 'admin' });
      campaignRepository.create.mockResolvedValue({ ...data, _id: 'camp123' });

      const result = await campaignService.createCampaign(data);

      expect(campaignRepository.create).toHaveBeenCalledWith(data);
      expect(result._id).toBe('camp123');
    });

    it('should throw error if title or goalAmount is missing', async () => {
      await expect(campaignService.createCampaign({ title: 'Test' }))
        .rejects.toThrow('Title and goal amount are required');
    });
  });

  describe('getCampaignById', () => {
    it('should return campaign with NGO details', async () => {
      const campId = 'camp123';
      const mockCampaign = { 
        _id: campId, 
        title: 'Test', 
        createdBy: 'user123',
        toObject: jest.fn().mockReturnValue({ _id: campId, title: 'Test', createdBy: 'user123' })
      };
      const mockNgo = { _id: 'ngo123', organizationName: 'Test NGO', userId: 'user123' };

      campaignRepository.findById.mockResolvedValue(mockCampaign);
      ngoRepository.findByUserId.mockResolvedValue(mockNgo);

      const result = await campaignService.getCampaignById(campId);

      expect(campaignRepository.findById).toHaveBeenCalledWith(campId);
      expect(result.createdBy.organizationName).toBe('Test NGO');
    });

    it('should throw error if campaign not found', async () => {
      campaignRepository.findById.mockResolvedValue(null);
      await expect(campaignService.getCampaignById('nonexistent'))
        .rejects.toThrow('Campaign not found');
    });
  });
});
