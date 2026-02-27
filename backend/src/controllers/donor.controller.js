import * as donorService from '../services/donor.service.js';

//Donor Profile

/**
 * Create a new donor profile for the authenticated user.
 */
export const createDonor = async (req, res) => {
  try {
    const donor = await donorService.createDonorProfile(req.body, req.user.id);
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get all donor profiles.
 */
export const getAllDonors = async (req, res) => {
  try {
    const donors = await donorService.getAllDonors(req.query);
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get a donor by ID.
 */
export const getDonorById = async (req, res) => {
  try {
    const donor = await donorService.getDonorById(req.params.id);
    res.json(donor);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * Get the donor profile for the authenticated user.
 */
export const getMyDonorProfile = async (req, res) => {
  try {
    const donor = await donorService.getDonorByUserId(req.user.id);
    res.json(donor);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateDonor = async (req, res) => {
  try {
    const donor = await donorService.updateDonor(req.params.id, req.body);
    res.json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    await donorService.softDeleteDonor(req.params.id);
    res.json({ message: 'Donor profile deactivated (GDPR soft delete)' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Pledges
/**
 * Create a pledge for a donor.
 */
export const createPledge = async (req, res) => {
  try {
    const donor = await donorService.createPledge(req.params.id, req.body);
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Update a specific pledge by donor ID and pledge ID.
 */
export const updatePledge = async (req, res) => {
  try {
    const donor = await donorService.updatePledge(req.params.id, req.params.pledgeId, req.body);
    res.json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePledge = async (req, res) => {
  try {
    await donorService.deletePledge(req.params.id, req.params.pledgeId);
    res.json({ message: 'Pledge deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Interactions
/**
 * Create an interaction (call, meeting, email) for a donor.
 */
export const createInteraction = async (req, res) => {
  try {
    const donor = await donorService.createInteraction(req.params.id, req.body, req.user.id);
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInteraction = async (req, res) => {
  try {
    const donor = await donorService.deleteInteraction(req.params.id, req.params.interactionId);
    res.json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Analytics

export const getDonorAnalytics = async (req, res) => {
  try {
    const analytics = await donorService.getDonorAnalytics(req.params.id);
    res.json(analytics);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getSegmentAnalytics = async (req, res) => {
  try {
    const stats = await donorService.getSegmentAnalytics();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Recalculate donor analytics based on fulfilled pledges and interactions.
 */
export const recalculateAnalytics = async (req, res) => {
  try {
    const donor = await donorService.recalculateDonorAnalytics(req.params.id);
    res.json(donor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};