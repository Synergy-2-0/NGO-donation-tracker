import * as campaignRepository from "../repository/campaign.repository.js";
import Progress from "../models/progressLog.model.js";

export const createCampaign = async (data) => {
    if (!data.title || !data.goalAmount) {
        throw new Error("Title and goal amount are required");
    }

    return await campaignRepository.create(data);
};

export const getAllCampaigns = async () => {
    return await campaignRepository.findAll();
};

export const getCampaignById = async (id) => {
    const campaign = await campaignRepository.findById(id);

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    return campaign;
};

export const updateCampaign = async (id, data) => {
    return await campaignRepository.updateById(id, data);
};

export const deleteCampaign = async (id) => {
    return await campaignRepository.softDelete(id);
};

export const publishCampaign = async (id) => {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) throw new Error("Campaign not found");

    if (campaign.status !== "draft") throw new Error("Only draft campaigns can be published");

    return await campaignRepository.updateById(id, { status: "active" });
};


export const getCampaignMetrics = async (campaignId) => {
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) throw new Error("Campaign not found");

    const progressLogs = await Progress.find({ campaign: campaignId });

    const totalBeneficiaries = progressLogs.reduce(
        (sum, log) => sum + (log.beneficiaries || 0),
        0
    );

    const totalRaised = campaign.raisedAmount;

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