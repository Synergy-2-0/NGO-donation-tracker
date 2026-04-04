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
    const [metrics, trends, leaderboard] = await Promise.all([
        transparencyService.getImpactMetrics(),
        transparencyService.getTrends(),
        transparencyService.getLeaderboard()
    ]);
    res.json({ ...metrics, trends, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicDonorStats = async (req, res) => {
  try {
    const stats = await transparencyService.getPublicDonorStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMapData = async (req, res) => {
  try {
    const mapData = await transparencyService.getMapData();
    res.json(mapData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCampaignPublicPartners = async (req, res) => {
  try {
    const data = await transparencyService.getCampaignPublicPartners(req.params.campaignId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
