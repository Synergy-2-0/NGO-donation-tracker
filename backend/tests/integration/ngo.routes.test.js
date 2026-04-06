import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';

const ngoServiceMock = {
  registerNGO: jest.fn(),
  getNGOProfile: jest.fn(),
  updateNGOProfile: jest.fn(),
  getAllNGOs: jest.fn(),
  approveNGO: jest.fn(),
  rejectNGO: jest.fn(),
  getNGOMetrics: jest.fn(),
};

jest.unstable_mockModule('../../src/services/ngo.service.js', () => ({
  registerNGO: ngoServiceMock.registerNGO,
  getNGOProfile: ngoServiceMock.getNGOProfile,
  updateNGOProfile: ngoServiceMock.updateNGOProfile,
  getAllNGOs: ngoServiceMock.getAllNGOs,
  approveNGO: ngoServiceMock.approveNGO,
  rejectNGO: ngoServiceMock.rejectNGO,
  getNGOMetrics: ngoServiceMock.getNGOMetrics,
  calculateTrustScore: jest.fn(),
}));

const express = (await import('express')).default;
const ngoRoutes = (await import('../../src/routes/ngo.routes.js')).default;

const app = express();
app.use(express.json());
app.use('/api/ngos', ngoRoutes);

const makeToken = (role, id = '507f1f77bcf86cd799439011') => {
  return jwt.sign({ id, role, userId: id }, process.env.JWT_SECRET);
};

describe('NGO Routes Integration Tests', () => {
  const VALID_ID = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/ngos/register registers NGO for authenticated user', async () => {
    ngoServiceMock.registerNGO.mockResolvedValue({ _id: VALID_ID, organizationName: 'Save the World' });

    const response = await request(app)
      .post('/api/ngos/register')
      .set('Authorization', `Bearer ${makeToken('user')}`)
      .send({ organizationName: 'Save the World', registrationNumber: 'NGO123' });

    expect(response.status).toBe(201);
    expect(ngoServiceMock.registerNGO).toHaveBeenCalled();
  });

  test('GET /api/ngos/profile returns profile for owner', async () => {
    ngoServiceMock.getNGOProfile.mockResolvedValue({ _id: VALID_ID, organizationName: 'Save the World' });

    const response = await request(app)
      .get('/api/ngos/profile')
      .set('Authorization', `Bearer ${makeToken('ngo-admin')}`);

    expect(response.status).toBe(200);
    expect(ngoServiceMock.getNGOProfile).toHaveBeenCalled();
  });

  test('PATCH /api/ngos/:id/approve blocks non-admin', async () => {
    const response = await request(app)
      .patch(`/api/ngos/${VALID_ID}/approve`)
      .set('Authorization', `Bearer ${makeToken('ngo-admin')}`);

    expect(response.status).toBe(403);
  });

  test('PATCH /api/ngos/:id/approve works for admin', async () => {
    ngoServiceMock.approveNGO.mockResolvedValue({ _id: VALID_ID, status: 'approved' });
    const response = await request(app)
      .patch(`/api/ngos/${VALID_ID}/approve`)
      .set('Authorization', `Bearer ${makeToken('admin')}`);

    expect(response.status).toBe(200);
    expect(ngoServiceMock.approveNGO).toHaveBeenCalled();
  });
});
