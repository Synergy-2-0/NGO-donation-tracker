import * as trustScoreService from "../services/trustScore.service.js";

/**
 * Get trust score for an NGO
 * Route: GET /api/finance/trust-score/:ngoId
 */
export const getTrustScore = async (req, res) => {
    try {
        const trustScore = await trustScoreService.calculateTrustScore(
            req.params.ngoId
        );
        res.json({
            success: true,
            data: trustScore,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get transparency report for an NGO
 * Route: GET /api/finance/transparency-report/:ngoId
 */
export const getTransparencyReport = async (req, res) => {
    try {
        const report = await trustScoreService.getTransparencyReport(
            req.params.ngoId
        );
        res.json({
            success: true,
            data: report,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Compare trust scores across multiple NGOs
 * Route: POST /api/finance/trust-score/compare
 * Body: { ngoIds: ["id1", "id2", "id3"] }
 */
export const compareTrustScores = async (req, res) => {
    try {
        const { ngoIds } = req.body;
        const comparison = await trustScoreService.compareTrustScores(ngoIds);
        res.json({
            success: true,
            data: comparison,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
