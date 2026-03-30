import partnerService from "../services/partner.service.js";

// Create new partnership
export const createPartnership = async (req, res) => {
  try {
    const partnership = await partnerService.createPartnership(req.body, req.user.id);
    res.status(201).json(partnership);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all partners
export const getPartners = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin' || req.user?.role === 'ngo-admin';
    const partners = await partnerService.getPartners(req.query, isAdmin);
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single partner by ID
export const getPartner = async (req, res) => {
  try {
    const partner = await partnerService.getPartnerById(req.params.id, req.user);
    res.json(partner);
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : err.message === 'Unauthorized' ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

// Update partner
export const updatePartner = async (req, res) => {
  try {
    const partner = await partnerService.updatePartner(req.params.id, req.body, req.user);
    res.json(partner);
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : err.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: err.message });
  }
};

// Approve partner (admin only)
export const approvePartner = async (req, res) => {
  try {
    const partner = await partnerService.approvePartner(req.params.id, req.user.id);
    res.json(partner);
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

// Delete partner
export const deletePartner = async (req, res) => {
  try {
    await partnerService.deletePartner(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : err.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: err.message });
  }
};

// Get public impact data for a verified partner
export const getPartnerImpact = async (req, res) => {
  try {
    const data = await partnerService.getPartnerImpact(req.params.id);
    res.json(data);
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : 500;
    res.status(status).json({ message: err.message });
  }
};

// Get current user's profile
export const getMyPartnerProfile = async (req, res) => {
  try {
    const partner = await partnerService.getPartnerByUserId(req.user.id);
    res.json(partner);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};