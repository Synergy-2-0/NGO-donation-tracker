import ProgressLog from "../models/progressLog.model.js";

export const create = (data) => ProgressLog.create(data);

export const findByCampaign = (campaignId) =>
    ProgressLog.find({ campaign: campaignId });

export const updateById = (id, data) =>
    ProgressLog.findByIdAndUpdate(id, data, { new: true });

export const deleteById = (id) =>
    ProgressLog.findByIdAndDelete(id);
