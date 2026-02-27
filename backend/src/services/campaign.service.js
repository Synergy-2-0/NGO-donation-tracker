import * as campaignRepository from "../repository/campaign.repository.js";
import Progress from "../models/progressLog.model.js";

/**
 * Create a new campaign.
 */
export const createCampaign = async (data) => {
    if (!data.title || !data.goalAmount) {
        throw new Error("Title and goal amount are required");
    }

    return await campaignRepository.create(data);
};

/**
 * Retrieve all campaigns.
 */
export const getAllCampaigns = async () => {
    return await campaignRepository.findAll();
};

/**
 * Get a campaign by its ID.
 */
export const getCampaignById = async (id) => {
    const campaign = await campaignRepository.findById(id);

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    return campaign;
};

/**
 * Update campaign details.
 */
export const updateCampaign = async (id, data) => {
    return await campaignRepository.updateById(id, data);
};

export const deleteCampaign = async (id) => {
    return await campaignRepository.softDelete(id);
};

/**
 * Publish a campaign.
 * Business rules:
 *  - Only campaigns in "draft" status can be published.
 *  - Publishing makes the campaign visible and active.
 */
export const publishCampaign = async (id) => {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) throw new Error("Campaign not found");

    if (campaign.status !== "draft") throw new Error("Only draft campaigns can be published");

    return await campaignRepository.updateById(id, { status: "active" });
};

/**
 * Calculate campaign performance metrics.
 * Combines campaign data with progress logs.
 */
export const getCampaignMetrics = async (campaignId) => {
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) throw new Error("Campaign not found");

    const progressLogs = await Progress.find({ campaign: campaignId });

    const totalBeneficiaries = progressLogs.reduce(
        (sum, log) => sum + (log.beneficiaries || 0),
        0
    );
    // Total funds raised so far
    const totalRaised = campaign.raisedAmount;

    /**
 * Completion rate shows how close the campaign is to its goal.
 */
    const completionRate =
        campaign.goalAmount > 0
            ? (totalRaised / campaign.goalAmount) * 100
            : 0;

    return {
        totalRaised,
        goalAmount: campaign.goalAmount,
        totalBeneficiaries,
        progressCount: progressLogs.length,
        completionRate: Number(completionRate.toFixed(2)),
    };
};