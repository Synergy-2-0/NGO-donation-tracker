import Report from "../models/campaignReport.model.js";

export const create = async (data) => {
    return await Report.create(data);
};

export const findByCampaign = async (campaignId) => {
    return await Report.findOne({ campaign: campaignId });
};

export const findById = async (id) => {
    return await Report.findById(id);
};
