import Campaign from "../models/campaign.model.js";

export const create = async (data) => {
    return await Campaign.create(data);
};

export const findAll = async () => {
    return await Campaign.find({ isDeleted: false });
};

export const findById = async (id) => {
    return await Campaign.findById(id);
};

export const updateById = async (id, data) => {
    return await Campaign.findByIdAndUpdate(id, data, { new: true });
};

export const softDelete = async (id) => {
    return await Campaign.findByIdAndUpdate(id, {
        isDeleted: true,
        status: "archived",
    });
};
