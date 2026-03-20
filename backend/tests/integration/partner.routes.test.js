import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-secret';

const partnerServiceMock = {
  createPartnership: jest.fn(),
  getPartners: jest.fn(),
  getPartnerById: jest.fn(),
  updatePartner: jest.fn(),
  approvePartner: jest.fn(),
  deletePartner: jest.fn(),
  getPartnerImpact: jest.fn(),
};

jest.unstable_mockModule('../../src/services/partner.service.js', () => ({
  default: partnerServiceMock,
}));

const express = (await import('express')).default;
const { default: partnerRoutes } = await import('../../src/routes/partners.routes.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/partners', partnerRoutes);

const makeToken = (role, id = '507f1f77bcf86cd799439011') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET);
};

const validPartnerPayload = {
  organizationName: 'Acme Foundation',
  organizationType: 'foundation',
  industry: 'Nonprofit',
  contactPerson: {
    name: 'Alice',
    email: 'alice@example.com',
    phone: '+94771234567',
    position: 'Manager',
  },
  address: {
    street: '12 Main St',
    city: 'Colombo',
    state: 'Western',
    country: 'Sri Lanka',
    postalCode: '00100',
    coordinates: {
      type: 'Point',
      coordinates: [79.8612, 6.9271],
    },
  },
  csrFocus: ['education'],
  sdgGoals: [4],
  partnershipPreferences: {
    budgetRange: {
      min: 1000,
      max: 5000,
    },
    partnershipTypes: ['financial'],
    duration: 'long-term',
    geographicFocus: ['Colombo'],
  },
  capabilities: {
    financialCapacity: 20000,
    inKindOfferings: ['Books'],
    skillsAvailable: ['technology'],
    employeeCount: 10,
    volunteerHoursAvailable: 100,
  },
};

describe('Partner Routes - Endpoint Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/partners creates partner for partner role', async () => {
    partnerServiceMock.createPartnership.mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      ...validPartnerPayload,
    });

    const ownerId = '507f1f77bcf86cd799439013';
    const response = await request(app)
      .post('/api/partners')
      .set('Authorization', `Bearer ${makeToken('partner', ownerId)}`)
      .send(validPartnerPayload);

    expect(response.status).toBe(201);
    expect(partnerServiceMock.createPartnership).toHaveBeenCalledWith(
      expect.objectContaining({ organizationName: 'Acme Foundation' }),
      ownerId
    );
  });

  test('POST /api/partners rejects invalid payload', async () => {
    const response = await request(app)
      .post('/api/partners')
      .set('Authorization', `Bearer ${makeToken('partner')}`)
      .send({ industry: 'Nonprofit' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(partnerServiceMock.createPartnership).not.toHaveBeenCalled();
  });

  test('POST /api/partners blocks non-partner role', async () => {
    const response = await request(app)
      .post('/api/partners')
      .set('Authorization', `Bearer ${makeToken('donor')}`)
      .send(validPartnerPayload);

    expect(response.status).toBe(403);
    expect(partnerServiceMock.createPartnership).not.toHaveBeenCalled();
  });

  test('GET /api/partners uses admin visibility path', async () => {
    partnerServiceMock.getPartners.mockResolvedValue([{ _id: 'a' }]);

    const response = await request(app)
      .get('/api/partners?status=active')
      .set('Authorization', `Bearer ${makeToken('admin')}`);

    expect(response.status).toBe(200);
    expect(partnerServiceMock.getPartners).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'active' }),
      true
    );
  });

  test('GET /api/partners uses public visibility for non-admin role', async () => {
    partnerServiceMock.getPartners.mockResolvedValue([{ _id: 'a' }]);

    const response = await request(app)
      .get('/api/partners')
      .set('Authorization', `Bearer ${makeToken('donor')}`);

    expect(response.status).toBe(200);
    expect(partnerServiceMock.getPartners).toHaveBeenCalledWith({}, false);
  });

  test('GET /api/partners/:id/impact resolves impact route (not shadowed by :id)', async () => {
    partnerServiceMock.getPartnerImpact.mockResolvedValue({ organizationName: 'Acme Foundation' });

    const response = await request(app)
      .get('/api/partners/507f1f77bcf86cd799439014/impact')
      .set('Authorization', `Bearer ${makeToken('admin')}`);

    expect(response.status).toBe(200);
    expect(partnerServiceMock.getPartnerImpact).toHaveBeenCalledWith('507f1f77bcf86cd799439014');
    expect(partnerServiceMock.getPartnerById).not.toHaveBeenCalled();
  });

  test('GET /api/partners/:id maps Unauthorized to 403', async () => {
    partnerServiceMock.getPartnerById.mockRejectedValue(new Error('Unauthorized'));

    const response = await request(app)
      .get('/api/partners/507f1f77bcf86cd799439015')
      .set('Authorization', `Bearer ${makeToken('partner')}`);

    expect(response.status).toBe(403);
  });

  test('PUT /api/partners/:id updates partner', async () => {
    partnerServiceMock.updatePartner.mockResolvedValue({ _id: '507f1f77bcf86cd799439016', organizationName: 'Updated Org' });

    const userId = '507f1f77bcf86cd799439017';
    const response = await request(app)
      .put('/api/partners/507f1f77bcf86cd799439016')
      .set('Authorization', `Bearer ${makeToken('partner', userId)}`)
      .send({ organizationName: 'Updated Org' });

    expect(response.status).toBe(200);
    expect(partnerServiceMock.updatePartner).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439016',
      { organizationName: 'Updated Org' },
      expect.objectContaining({ id: userId, role: 'partner' })
    );
  });

  test('PATCH /api/partners/:id/approve works for admin', async () => {
    partnerServiceMock.approvePartner.mockResolvedValue({ _id: '507f1f77bcf86cd799439018', verificationStatus: 'verified' });

    const adminId = '507f1f77bcf86cd799439019';
    const response = await request(app)
      .patch('/api/partners/507f1f77bcf86cd799439018/approve')
      .set('Authorization', `Bearer ${makeToken('admin', adminId)}`);

    expect(response.status).toBe(200);
    expect(partnerServiceMock.approvePartner).toHaveBeenCalledWith('507f1f77bcf86cd799439018', adminId);
  });

  test('DELETE /api/partners/:id performs soft delete path', async () => {
    partnerServiceMock.deletePartner.mockResolvedValue({ _id: '507f1f77bcf86cd799439020', status: 'inactive' });

    const response = await request(app)
      .delete('/api/partners/507f1f77bcf86cd799439020')
      .set('Authorization', `Bearer ${makeToken('partner')}`);

    expect(response.status).toBe(204);
    expect(partnerServiceMock.deletePartner).toHaveBeenCalled();
  });
});
