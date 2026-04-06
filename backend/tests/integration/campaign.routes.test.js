import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';

const campaignServiceMock = {
  createCampaign: jest.fn(),
  getAllCampaigns: jest.fn(),
  getCampaignById: jest.fn(),
  updateCampaign: jest.fn(),
  deleteCampaign: jest.fn(),
  getMyCampaigns: jest.fn(),
  submitCampaign: jest.fn(),
  publishCampaign: jest.fn(),
  getCampaignMetrics: jest.fn(),
};

// Mock the entire service module
jest.unstable_mockModule('../../src/services/campaign.service.js', () => ({
  ...campaignServiceMock,
}));

// Mock multer to avoid disk/storage issues in tests
jest.unstable_mockModule('../../src/middlewares/upload.middleware.js', () => ({
  default: {
    single: () => (req, res, next) => next(),
    array: () => (req, res, next) => next(),
  }
}));

const express = (await import('express')).default;
const campaignRoutes = (await import('../../src/routes/campaign.routes.js')).default;

const app = express();
app.use(express.json());
app.use('/api/campaigns', campaignRoutes);

const makeToken = (role, id = '507f1f77bcf86cd799439011') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET);
};

describe('Campaign Routes Integration Tests', () => {
  const VALID_ID = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/campaigns creates campaign for ngo-admin', async () => {
    campaignServiceMock.createCampaign.mockResolvedValue({ _id: VALID_ID, title: 'Health Mission' });

    const response = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${makeToken('ngo-admin')}`)
      .send({ title: 'Health Mission', goalAmount: 5000, location: {} });

    if (response.status !== 201) {
        console.error('Test Failed Output:', response.body);
    }

    expect(response.status).toBe(201);
    expect(campaignServiceMock.createCampaign).toHaveBeenCalled();
  });

  test('POST /api/campaigns blocks donor role', async () => {
    const response = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${makeToken('donor')}`)
      .send({ title: 'Health Mission' });

    expect(response.status).toBe(403);
    expect(campaignServiceMock.createCampaign).not.toHaveBeenCalled();
  });

  test('GET /api/campaigns is public', async () => {
    campaignServiceMock.getAllCampaigns.mockResolvedValue([{ _id: VALID_ID, title: 'Water project' }]);

    const response = await request(app).get('/api/campaigns');

    expect(response.status).toBe(200);
    expect(campaignServiceMock.getAllCampaigns).toHaveBeenCalled();
  });

  test('DELETE /api/campaigns/:id blocks ngo-admin (only admin can delete)', async () => {
    const response = await request(app)
        .delete(`/api/campaigns/${VALID_ID}`)
        .set('Authorization', `Bearer ${makeToken('ngo-admin')}`);

    expect(response.status).toBe(403);
  });
});
