import ProgressLog from "../models/progressLog.model.js";

export const create = (data) => ProgressLog.create(data);

export const findByCampaign = (campaignId) =>
    // Support both current and legacy key names so historical logs still appear.
    ProgressLog.find({
        $or: [{ campaign: campaignId }, { campaignId }]
    }).sort({ createdAt: -1 });

export const updateById = (id, data) =>
    ProgressLog.findByIdAndUpdate(id, data, { new: true });

export const deleteById = (id) =>
    ProgressLog.findByIdAndDelete(id);
