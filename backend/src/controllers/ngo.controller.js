import * as ngoService from '../services/ngo.service.js';

export const register = async (req, res) => {
  try {
    const ngo = await ngoService.registerNGO(req.user.id, req.body);
    res.status(201).json(ngo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await ngoService.getNGOProfile(req.user.id);
    if (!profile) return res.status(404).json({ message: 'NGO profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await ngoService.updateNGOProfile(req.user.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const ngos = await ngoService.getAllNGOs(req.query);
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approve = async (req, res) => {
  try {
    const approved = await ngoService.approveNGO(req.params.id);
    res.json(approved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const reject = async (req, res) => {
  try {
    const rejected = await ngoService.rejectNGO(req.params.id);
    res.json(rejected);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTrustScore = async (req, res) => {
  try {
    const updated = await ngoService.calculateTrustScore(req.params.id);
    res.json({ trustScore: updated.trustScore });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMetrics = async (req, res) => {
  try {
    const metrics = await ngoService.getNGOMetrics(req.user.id);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLedger = async (req, res) => {
  try {
    const ledger = await ngoService.getNGOLedger(req.user.id);
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
