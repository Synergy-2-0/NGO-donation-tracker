import Campaign from "../models/campaign.model.js";

export const create = async (data) => {
    return await Campaign.create(data);
};

export const findAll = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.city) {
        query['location.city'] = new RegExp(filters.city, 'i');
    }

    if (filters.state) {
        query['location.state'] = new RegExp(filters.state, 'i');
    }

    if (filters.lat !== undefined && filters.lng !== undefined) {
        const radiusInKm = filters.radius || 50;
        query['location.coordinates'] = {
            $near: {
                $geometry: { type: 'Point', coordinates: [filters.lng, filters.lat] },
                $maxDistance: radiusInKm * 1000,
            },
        };
    }

    return await Campaign.find(query).sort({ createdAt: -1 });
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
