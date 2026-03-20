import * as campaignRepository from "../repository/campaign.repository.js";
import Progress from "../models/progressLog.model.js";
import geocodingService from './geocoding.service.js';

const hasCoordinates = (location) => {
    return Array.isArray(location?.coordinates?.coordinates) && location.coordinates.coordinates.length === 2;
};

/**
 * Create a new campaign.
 */
export const createCampaign = async (data) => {
    if (!data.title || !data.goalAmount) {
        throw new Error("Title and goal amount are required");
    }

    if (data.location && !hasCoordinates(data.location)) {
        const geocoded = await geocodingService.geocodeAddress({
            city: data.location.city,
            state: data.location.state,
            country: data.location.country,
        });
        if (geocoded) {
            data.location.coordinates = geocoded;
        }
    }

    return await campaignRepository.create(data);
};

/**
 * Retrieve all campaigns.
 */
export const getAllCampaigns = async (filters = {}) => {
    const normalized = { ...filters };

    if (filters.lat !== undefined || filters.lng !== undefined) {
        if (filters.lat === undefined || filters.lng === undefined) {
            throw new Error('Both lat and lng are required for radius search');
        }

        const lat = Number(filters.lat);
        const lng = Number(filters.lng);
        const radius = filters.radius !== undefined ? Number(filters.radius) : 50;

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            throw new Error('lat and lng must be valid numbers');
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new Error('Invalid coordinates');
        }
        if (Number.isNaN(radius) || radius < 1 || radius > 500) {
            throw new Error('radius must be between 1 and 500');
        }

        normalized.lat = lat;
        normalized.lng = lng;
        normalized.radius = radius;
    }

    return await campaignRepository.findAll(normalized);
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
    if (data.location && !hasCoordinates(data.location)) {
        const campaign = await campaignRepository.findById(id);
        if (!campaign) throw new Error('Campaign not found');

        const geocoded = await geocodingService.geocodeAddress({
            city: data.location.city || campaign.location?.city,
            state: data.location.state || campaign.location?.state,
            country: data.location.country || campaign.location?.country,
        });
        if (geocoded) {
            data.location.coordinates = geocoded;
        }
    }

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