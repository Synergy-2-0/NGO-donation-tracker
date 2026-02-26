import * as progressRepository from "../repository/progress.repository.js";
import Campaign from "../models/campaign.model.js";

export const createProgress = async (data) => {
    const campaign = await Campaign.findById(data.campaign);

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    if (campaign.status !== "active") {
        throw new Error("Progress can only be added to active campaigns");
    }

    return progressRepository.create(data);
};

export const getCampaignProgress = async (campaignId) => {
    return progressRepository.findByCampaign(campaignId);
};

export const updateProgress = async (id, data) => {
    return progressRepository.updateById(id, data);
};

export const deleteProgress = async (id) => {
    return progressRepository.deleteById(id);
};
