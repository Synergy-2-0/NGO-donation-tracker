import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';

const donorServiceMock = {
  createDonorProfile: jest.fn(),
  getDonorById: jest.fn(),
  getDonorByUserId: jest.fn(),
  getAllDonors: jest.fn(),
  updateDonor: jest.fn(),
  getDonorAnalytics: jest.fn(),
  getAllPledgers: jest.fn(),
  getAllPledges: jest.fn(),
  getSegmentAnalytics: jest.fn(),
  getDonorPledges: jest.fn(),
  getDonorPledgeById: jest.fn(),
  createPledge: jest.fn(),
  updatePledge: jest.fn(),
  deletePledge: jest.fn(),
};

jest.unstable_mockModule('../../src/services/donor.service.js', () => ({
  createDonorProfile: donorServiceMock.createDonorProfile,
  getDonorById: donorServiceMock.getDonorById,
  getDonorByUserId: donorServiceMock.getDonorByUserId,
  getAllDonors: donorServiceMock.getAllDonors,
  updateDonor: donorServiceMock.updateDonor,
  getDonorAnalytics: donorServiceMock.getDonorAnalytics,
  getAllPledgers: donorServiceMock.getAllPledgers,
  getAllPledges: donorServiceMock.getAllPledges,
  getSegmentAnalytics: donorServiceMock.getSegmentAnalytics,
  getDonorPledges: donorServiceMock.getDonorPledges,
  getDonorPledgeById: donorServiceMock.getDonorPledgeById,
  createPledge: donorServiceMock.createPledge,
  updatePledge: donorServiceMock.updatePledge,
  deletePledge: donorServiceMock.deletePledge,
}));

const express = (await import('express')).default;
const donorRoutes = (await import('../../src/routes/donor.routes.js')).default;

const app = express();
app.use(express.json());
app.use('/api/donors', donorRoutes);

const makeToken = (role, id = '507f1f77bcf86cd799439011') => {
  return jwt.sign({ id, role, userId: id }, process.env.JWT_SECRET);
};

describe('Donor Routes Integration Tests', () => {
  const VALID_ID = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/donors registers donor profile', async () => {
    donorServiceMock.createDonorProfile.mockResolvedValue({ _id: VALID_ID, userId: VALID_ID });

    const response = await request(app)
      .post('/api/donors')
      .set('Authorization', `Bearer ${makeToken('donor')}`)
      .send({ firstName: 'John', lastName: 'Doe' });

    expect(response.status).toBe(201);
  });

  test('GET /api/donors/me returns personal donor profile', async () => {
    donorServiceMock.getDonorByUserId.mockResolvedValue({ _id: VALID_ID, firstName: 'John' });

    const response = await request(app)
      .get('/api/donors/me')
      .set('Authorization', `Bearer ${makeToken('donor')}`);

    expect(response.status).toBe(200);
  });

  test('GET /api/donors blocks non-privileged users', async () => {
    const response = await request(app)
      .get('/api/donors')
      .set('Authorization', `Bearer ${makeToken('donor')}`);

    expect(response.status).toBe(403);
  });
});
