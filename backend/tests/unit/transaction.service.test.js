import * as transactionService from '../../src/services/transaction.service.js';
import * as transactionRepository from '../../src/repository/transaction.repository.js';
import * as campaignRepository from '../../src/repository/campaign.repository.js';
import * as donorRepository from '../../src/repository/donor.repository.js';

jest.mock('../../src/repository/transaction.repository.js');
jest.mock('../../src/repository/campaign.repository.js');
jest.mock('../../src/repository/donor.repository.js');
jest.mock('../../src/repository/ngo.repository.js');
jest.mock('../../src/repository/partner.repository.js');
jest.mock('../../src/repository/auditLog.repository.js');
jest.mock('../../src/services/trustScore.service.js');
jest.mock('../../src/services/email.service.js');

describe('Transaction Service Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a transaction when required fields are present', async () => {
      const data = { donorId: 'donor123', ngoId: 'ngo123', amount: 5000 };
      transactionRepository.create.mockResolvedValue({ ...data, _id: 'trans123' });

      const result = await transactionService.createTransaction(data);

      expect(transactionRepository.create).toHaveBeenCalledWith(data);
      expect(result._id).toBe('trans123');
    });

    it('should throw error if required fields are missing', async () => {
      await expect(transactionService.createTransaction({ amount: 5000 }))
        .rejects.toThrow('Donor ID, NGO ID, and amount are required');
    });
  });

  describe('completeDonation', () => {
    it('should update campaign and donor stats when donation is completed', async () => {
      const transId = 'trans123';
      const mockTrans = { 
        _id: transId, 
        donorId: 'donor123', 
        campaignId: 'camp123', 
        amount: 1000, 
        status: 'pending' 
      };
      const mockCamp = { _id: 'camp123', raisedAmount: 5000 };
      const mockDonor = { _id: 'donorDocRef', totalDonated: 2000, analytics: { donationCount: 2 } };

      transactionRepository.findById.mockResolvedValue(mockTrans);
      transactionRepository.updateById.mockResolvedValue({ ...mockTrans, status: 'completed' });
      campaignRepository.findById.mockResolvedValue(mockCamp);
      donorRepository.findByUserId.mockResolvedValue(mockDonor);

      const result = await transactionService.completeDonation(transId, 'pay_payment123');

      expect(transactionRepository.updateById).toHaveBeenCalledWith(transId, expect.objectContaining({ status: 'completed' }));
      expect(campaignRepository.updateById).toHaveBeenCalledWith('camp123', { raisedAmount: 6000 });
      expect(donorRepository.updateById).toHaveBeenCalledWith('donorDocRef', expect.objectContaining({ totalDonated: 3000 }));
    });
  });
});
