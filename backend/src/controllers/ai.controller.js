import aiService from '../services/ai.service.js';

/**
 * Get insights for the authenticated donor
 */
export const getDonorInsights = async (req, res, next) => {
  try {
    const insights = await aiService.getDonorInsights(req.user.id);
    res.json({ success: true, insights });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recommended partner matches for a donor
 */
export const getPartnerMatches = async (req, res, next) => {
  try {
    const matches = await aiService.getPartnerMatches(req.user.id);
    res.json({ success: true, matches });
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI-driven health analysis for a campaign
 */
export const analyzeCampaignHealth = async (req, res, next) => {
  try {
    const analysis = await aiService.analyzeCampaignHealth(req.params.id);
    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};
