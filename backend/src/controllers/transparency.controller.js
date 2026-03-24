import transparencyService from '../services/transparency.service.js';

export const getPublicPartnerships = async (req, res) => {
  try {
    const data = await transparencyService.getPublicDashboard();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPartnerPublicAgreements = async (req, res) => {
  try {
    const data = await transparencyService.getPartnerPublicAgreements(req.params.partnerId);
    res.json(data);
  } catch (error) {
    const status = error.message === 'Partner not found' ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const getImpactMetrics = async (req, res) => {
  try {
    const data = await transparencyService.getImpactMetrics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
