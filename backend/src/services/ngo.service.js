import * as ngoRepository from '../repository/ngo.repository.js';
import User from '../models/user.model.js';
import Campaign from '../models/campaign.model.js';

export const registerNGO = async (userId, ngoData) => {
  const existingNGO = await ngoRepository.findByUserId(userId);
  if (existingNGO) {
    throw new Error('User already has an NGO profile');
  }

  const ngo = await ngoRepository.create({
    ...ngoData,
    userId
  });

  // Update user role to ngo-admin if not already
  await User.findByIdAndUpdate(userId, { role: 'ngo-admin' });

  return ngo;
};

export const getNGOProfile = async (userId) => {
  return await ngoRepository.findByUserId(userId);
};

export const updateNGOProfile = async (userId, updateData) => {
  const ngo = await ngoRepository.findByUserId(userId);
  if (!ngo) throw new Error('NGO profile not found');
  
  return await ngoRepository.update(ngo._id, updateData);
};

export const getAllNGOs = async (filter) => {
  return await ngoRepository.findAll(filter);
};

export const approveNGO = async (id) => {
  const ngo = await ngoRepository.update(id, { status: 'approved' });
  // Initialize trust score after approval if needed, though default is based on reports/allocations
  return ngo;
};

export const rejectNGO = async (id) => {
  return await ngoRepository.update(id, { status: 'rejected' });
};

export const calculateTrustScore = async (ngoId) => {
  const ngo = await ngoRepository.findById(ngoId);
  if (!ngo) throw new Error('NGO not found');

  // Simulated logic: start with 50, +10 for documents, +20 for frequency of reports, etc.
  let score = 50;
  if (ngo.verificationDocuments.length > 0) score += 20;
  if (ngo.totalFundsRaised > 100000) score += 10;
  if (ngo.totalBeneficiaries > 100) score += 10;
  
  const finalScore = Math.min(100, score);
  return await ngoRepository.update(ngoId, { trustScore: finalScore });
};

export const getNGOMetrics = async (userId) => {
    const ngo = await ngoRepository.findByUserId(userId);
    if (!ngo) throw new Error('NGO not found');

    const campaigns = await Campaign.find({ createdBy: userId, isDeleted: false });
    
    const activeProjects = campaigns.filter(c => c.status === 'active').length;
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    const availableFunds = totalRaised * 0.95; // Simulated 5% operation fee

    return {
        trustScore: ngo.trustScore || 0,
        status: ngo.status,
        activeProjects,
        totalRaised,
        availableFunds,
        pendingApprovals: campaigns.filter(c => c.status === 'draft').length
    };
};

export const getNGOLedger = async (userId) => {
    // For now returning simulated history based on campaigns
    const campaigns = await Campaign.find({ createdBy: userId, isDeleted: false });
    return campaigns.map(c => ({
        _id: c._id,
        type: 'income',
        amount: c.raisedAmount || 0,
        description: `Revenue from ${c.title}`,
        date: c.updatedAt
    })).filter(l => l.amount > 0);
};
