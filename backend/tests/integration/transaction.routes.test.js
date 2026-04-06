import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';

const transactionServiceMock = {
  createTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  completeDonation: jest.fn(),
  getFinancialSummary: jest.fn(),
};

const payHereServiceMock = {
    handlePayHereCallback: jest.fn(),
    initPayHerePayment: jest.fn(),
    getConfig: jest.fn(),
    manualVerify: jest.fn(),
};

jest.unstable_mockModule('../../src/services/payhere.service.js', () => ({
    handlePayHereCallback: payHereServiceMock.handlePayHereCallback,
    initPayHerePayment: payHereServiceMock.initPayHerePayment,
    getPayHereConfig: payHereServiceMock.getConfig,
    manualVerify: payHereServiceMock.manualVerify,
}));

jest.unstable_mockModule('../../src/services/transaction.service.js', () => ({
  createTransaction: transactionServiceMock.createTransaction,
  getAllTransactions: transactionServiceMock.getAllTransactions,
  getTransactionById: transactionServiceMock.getTransactionById,
  completeDonation: transactionServiceMock.completeDonation,
  getFinancialSummary: transactionServiceMock.getFinancialSummary,
  getTransactionByOrderId: jest.fn(),
  getTransactionsByNgoId: jest.fn(),
  getTransactionsByDonorId: jest.fn(),
  getTransactionsByCampaignId: jest.fn(),
  updateTransaction: jest.fn(),
  archiveTransaction: jest.fn(),
}));

const express = (await import('express')).default;
const transactionRoutes = (await import('../../src/routes/finance.routes.js')).default;

const app = express();
app.use(express.json());
app.use('/api/finance', transactionRoutes);

const makeToken = (role, id = '507f1f77bcf86cd799439011') => {
  return jwt.sign({ id, role, userId: id }, process.env.JWT_SECRET);
};

describe('Transaction Routes Integration Tests', () => {
  const VALID_ID = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/finance/transactions registers a transaction for admin/system', async () => {
    transactionServiceMock.createTransaction.mockResolvedValue({ _id: VALID_ID, amount: 5000 });

    const response = await request(app)
      .post('/api/finance/transactions')
      .set('Authorization', `Bearer ${makeToken('admin')}`)
      .send({ donorId: VALID_ID, amount: 5000, ngoId: VALID_ID });

    expect(response.status).toBe(201);
    expect(transactionServiceMock.createTransaction).toHaveBeenCalled();
  });

  test('GET /api/finance/summary/ngo/:id works for admin/ngo-admin', async () => {
    transactionServiceMock.getFinancialSummary.mockResolvedValue({ totalFunds: 10000 });
    const response = await request(app)
      .get(`/api/finance/summary/ngo/${VALID_ID}`)
      .set('Authorization', `Bearer ${makeToken('admin')}`);

    expect(response.status).toBe(200);
    expect(transactionServiceMock.getFinancialSummary).toHaveBeenCalled();
  });

  test('POST /api/finance/payhere/callback resolves without auth (webhook)', async () => {
    payHereServiceMock.handlePayHereCallback.mockResolvedValue({ success: true, status: 'completed' });

    const response = await request(app)
      .post('/api/finance/payhere/callback')
      .send({ order_id: 'ORDER123', status_code: '2', merchant_id: '1234567', payhere_amount: '1000', payhere_currency: 'LKR', md5sig: 'fake-sig' });

    expect(response.status).toBe(200);
    expect(payHereServiceMock.handlePayHereCallback).toHaveBeenCalled();
  });
});
