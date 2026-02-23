import * as donorRepo from '../repository/donor.repository.js';
import * as userRepo from '../repository/user.repository.js';
import { sendDonorEmail } from '../utils/email.util.js';

//Donors

export const createDonorProfile = async (data, userId) => {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new Error('User not found');

  const existing = await donorRepo.findByUserId(userId);
  if (existing) throw new Error('Donor profile already exists for this user');

  return await donorRepo.create({ ...data, userId });
};

export const getAllDonors = async (filters = {}) => {
  return await donorRepo.findAll(filters);
};

export const getDonorById = async (id) => {
  const donor = await donorRepo.findById(id);
  if (!donor) throw new Error('Donor not found');
  return donor;
};

export const getDonorByUserId = async (userId) => {
  const donor = await donorRepo.findByUserId(userId);
  if (!donor) throw new Error('Donor profile not found');
  return donor;
};

export const updateDonor = async (id, data) => {
  const donor = await donorRepo.findById(id);
  if (!donor) throw new Error('Donor not found');

  // Prevent overwriting nested analytics or pledges directly
  const { pledges, interactions, analytics, ...safeData } = data;
  return await donorRepo.updateById(id, safeData);
};

export const softDeleteDonor = async (id) => {
  const donor = await donorRepo.findById(id);
  if (!donor) throw new Error('Donor not found');
  return await donorRepo.softDelete(id);
};

// Pledges

export const createPledge = async (donorId, pledgeData) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new Error('Donor not found');

  const updated = await donorRepo.addPledge(donorId, pledgeData);

  // Notify donor via email (third-party API integration)
  try {
    await sendDonorEmail(donor.userId?.email, 'pledge_created', {
      donorName: donor.userId?.name,
      amount: pledgeData.amount,
      frequency: pledgeData.frequency
    });
  } catch (emailErr) {
    console.warn('Email notification failed:', emailErr.message);
  }

  return updated;
};

export const updatePledge = async (donorId, pledgeId, pledgeData) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new Error('Donor not found');
  const pledge = donor.pledges.id(pledgeId);
  if (!pledge) throw new Error('Pledge not found');
  return await donorRepo.updatePledge(donorId, pledgeId, pledgeData);
};

export const deletePledge = async (donorId, pledgeId) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new Error('Donor not found');
  return await donorRepo.deletePledge(donorId, pledgeId);
};

//Interactions

export const createInteraction = async (donorId, interactionData, conductedBy) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new Error('Donor not found');
  return await donorRepo.addInteraction(donorId, { ...interactionData, conductedBy });
};

export const deleteInteraction = async (donorId, interactionId) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new Error('Donor not found');
  return await donorRepo.deleteInteraction(donorId, interactionId);
};

// Analytics

export const getDonorAnalytics = async (id) => {
  const donor = await donorRepo.findById(id);
  if (!donor) throw new Error('Donor not found');
  return donor.analytics;
};

export const getSegmentAnalytics = async () => {
  return await donorRepo.getSegmentStats();
};

export const recalculateDonorAnalytics = async (donorId) => {
  const donor = await donorRepo.findById(donorId);
  if (!donor) throw new Error('Donor not found');

  const activePledges = donor.pledges.filter(p => p.status === 'fulfilled');
  const totalDonated = activePledges.reduce((sum, p) => sum + p.amount, 0);
  const donationCount = activePledges.length;
  const averageDonation = donationCount > 0 ? totalDonated / donationCount : 0;
  const lastDonation = activePledges.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  // Simple retention score: based on donation count and recency
  const daysSinceLast = lastDonation
    ? (Date.now() - new Date(lastDonation.updatedAt)) / (1000 * 60 * 60 * 24)
    : 999;
  const retentionScore = Math.max(0, Math.min(100, donationCount * 10 - daysSinceLast * 0.5));

  const analytics = {
    totalDonated,
    donationCount,
    averageDonation: parseFloat(averageDonation.toFixed(2)),
    lastDonationDate: lastDonation?.updatedAt || null,
    retentionScore: parseFloat(retentionScore.toFixed(2))
  };

  return await donorRepo.updateAnalytics(donorId, analytics);
};