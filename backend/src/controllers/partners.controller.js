import partnerService from "../services/partner.service.js";

export const createPartnership = async (req, res) => {
  try {
    const partnership = await partnerService.createPartnership(req.body, req.user.id);
    res.status(201).json(partnership);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPartners = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const partners = await partnerService.getPartners(req.query, isAdmin);
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPartner = async (req, res) => {
  try {
    const partner = await partnerService.getPartnerById(req.params.id, req.user);
    res.json(partner);
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : err.message === 'Unauthorized' ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const partner = await partnerService.updatePartner(req.params.id, req.body, req.user);
    res.json(partner);
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : err.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: err.message });
  }
};

export const approvePartner = async (req, res) => {
  try {
    const partner = await partnerService.approvePartner(req.params.id, req.user.id);
    res.json(partner);
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
};

export const deletePartner = async (req, res) => {
  try {
    await partnerService.deletePartner(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    const status = err.message === 'Partner not found' ? 404 : err.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: err.message });
  }
};