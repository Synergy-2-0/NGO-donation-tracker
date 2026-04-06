import { jest, expect, describe, it, beforeEach } from '@jest/globals';

const transactionRepoMock = {
  create: jest.fn(),
  findById: jest.fn(),
  updateById: jest.fn(),
  findAll: jest.fn(),
};

const campaignRepoMock = {
  findById: jest.fn(),
  updateById: jest.fn(),
};

const donorRepoMock = {
  findByUserId: jest.fn(),
  updateById: jest.fn(),
};

const auditLogRepoMock = {
    create: jest.fn(),
};

const trustScoreMock = {
    recalculateTrustScore: jest.fn()
};

jest.unstable_mockModule('../../src/repository/transaction.repository.js', () => ({
  __esModule: true,
  ...transactionRepoMock,
  create: transactionRepoMock.create,
  findById: transactionRepoMock.findById,
  updateById: transactionRepoMock.updateById,
  findAll: transactionRepoMock.findAll,
}));

jest.unstable_mockModule('../../src/repository/campaign.repository.js', () => ({
  __esModule: true,
  ...campaignRepoMock,
  findById: campaignRepoMock.findById,
  updateById: campaignRepoMock.updateById,
}));

jest.unstable_mockModule('../../src/repository/donor.repository.js', () => ({
  __esModule: true,
  ...donorRepoMock,
  findByUserId: donorRepoMock.findByUserId,
  updateById: donorRepoMock.updateById,
}));

jest.unstable_mockModule('../../src/repository/auditLog.repository.js', () => ({
    __esModule: true,
    create: auditLogRepoMock.create,
}));

jest.unstable_mockModule('../../src/services/trustScore.service.js', () => ({
  ...trustScoreMock,
  recalculateTrustScore: trustScoreMock.recalculateTrustScore,
}));

jest.unstable_mockModule('../../src/services/email.service.js', () => ({
  sendPaymentConfirmation: jest.fn().mockResolvedValue({}),
}));

const transactionService = await import('../../src/services/transaction.service.js');

describe('Transaction Service Unit Tests', () => {
  const VALID_ID = '507f1f77bcf86cd799439011';
  const OTHER_ID = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a transaction when required fields are present', async () => {
      const data = { donorId: VALID_ID, ngoId: OTHER_ID, amount: 5000 };
      transactionRepoMock.create.mockResolvedValue({ ...data, _id: VALID_ID });

      const result = await transactionService.createTransaction(data);

      expect(transactionRepoMock.create).toHaveBeenCalledWith(data);
      expect(result._id).toBe(VALID_ID);
    });
  });

  describe('completeDonation', () => {
    it('should update campaign and donor stats when donation is completed', async () => {
      const transId = VALID_ID;
      const mockTrans = { 
        _id: transId, 
        donorId: OTHER_ID, 
        campaignId: VALID_ID, 
        amount: 1000, 
        status: 'pending' 
      };
      const mockCamp = { _id: VALID_ID, raisedAmount: 5000 };
      const mockDonor = { _id: OTHER_ID, totalDonated: 2000, analytics: { donationCount: 2 } };

      transactionRepoMock.findById.mockResolvedValue(mockTrans);
      transactionRepoMock.updateById.mockResolvedValue({ ...mockTrans, status: 'completed' });
      campaignRepoMock.findById.mockResolvedValue(mockCamp);
      donorRepoMock.findByUserId.mockResolvedValue(mockDonor);
      auditLogRepoMock.create.mockResolvedValue({});
      trustScoreMock.recalculateTrustScore.mockResolvedValue({});

      const result = await transactionService.completeDonation(transId, 'pay_payment123');

      expect(transactionRepoMock.updateById).toHaveBeenCalledWith(transId, expect.objectContaining({ status: 'completed' }));
      expect(campaignRepoMock.updateById).toHaveBeenCalledWith(VALID_ID, { raisedAmount: 6000 });
      expect(donorRepoMock.updateById).toHaveBeenCalledWith(OTHER_ID, expect.objectContaining({ totalDonated: 3000 }));
    });
  });
});
