import Campaign from "../models/campaign.model.js";

export const create = async (data) => {
    return await Campaign.create(data);
};

export const updateMany = async (filter, data) => {
    return await Campaign.updateMany(filter, data);
};

export const findAll = async (filters = {}) => {
    // Preserve existing mandatory filters and merge with dynamic ones Hub
    const query = { 
        isDeleted: false,
        ...filters 
    };

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.city) {
        query['location.city'] = new RegExp(filters.city, 'i');
        delete query.city; // Clean up the top-level property Hub
    }

    if (filters.state) {
        query['location.state'] = new RegExp(filters.state, 'i');
        delete query.state; // Clean up the top-level property Hub
    }

    if (filters.lat !== undefined && filters.lng !== undefined) {
        const radiusInKm = filters.radius || 50;
        query['location.coordinates'] = {
            $near: {
                $geometry: { type: 'Point', coordinates: [filters.lng, filters.lat] },
                $maxDistance: radiusInKm * 1000,
            },
        };
        // Clean up radius if it's not a model field Hub
        delete query.lat;
        delete query.lng;
        delete query.radius;
    }

    return await Campaign.find(query).populate('createdBy', 'name email').sort({ createdAt: -1 });
};

export const findById = async (id) => {
    return await Campaign.findById(id).populate('createdBy', 'name email');
};

export const updateById = async (id, data) => {
    return await Campaign.findByIdAndUpdate(id, data, { new: true }).populate('createdBy', 'name email');
};

export const softDelete = async (id) => {
    return await Campaign.findByIdAndUpdate(id, {
        isDeleted: true,
        status: "archived",
    });
};
