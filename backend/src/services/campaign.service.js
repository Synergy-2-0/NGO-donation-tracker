import * as campaignRepository from "../repository/campaign.repository.js";

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
