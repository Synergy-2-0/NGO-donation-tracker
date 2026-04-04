import * as campaignRepository from "../repository/campaign.repository.js";
import * as ngoRepository from "../repository/ngo.repository.js";
import Progress from "../models/progressLog.model.js";
import geocodingService from './geocoding.service.js';

const hasCoordinates = (location) => {
    return Array.isArray(location?.coordinates?.coordinates) && location.coordinates.coordinates.length === 2;
};

// Strategic Institutional Guard Hub
const ensureNgoApproved = async (userId) => {
    const ngo = await ngoRepository.findByUserId(userId);
    if (!ngo || ngo.status !== 'approved') {
        throw new Error("Your organization is currently awaiting verification. Mission initialization is locked until approval Sync!");
    }
    return ngo;
};

// Dynamic Mission Lifecycle Sync Hub Sync!
export const syncCampaignStatuses = async () => {
    const now = new Date();
    try {
        // Set expired active campaigns to completed Hub
        await campaignRepository.updateMany(
            { status: 'active', endDate: { $lt: now } },
            { status: 'completed' }
        );
        // Note: Automatic promotion from draft to active is DISABLED for security Hub. 
        // Missions must be approved by Platform Admins.
    } catch (error) {
        console.error("[Lifecycle Sync Error] Status synchronization failed Hub:", error);
    }
};

const canManageCampaign = (campaign, actor) => {
    if (!actor) return false;
    if (actor.role === "admin") return true;
    if (actor.role === "ngo-admin") {
        const actorId = String(actor.id || actor._id);
        const campaignCreatorId = campaign.createdBy 
            ? String(campaign.createdBy._id || campaign.createdBy) 
            : null;
        
        console.info(`[Auth Hard Check] Actor: ${actorId} | Mission Owner: ${campaignCreatorId || 'UNSET'}`);
        
        // If owner is unset, assume the current NGO admin is the authorized manager
        if (!campaignCreatorId) return true;
        return actorId === campaignCreatorId;
    }
    return false;
};

/**
 * Create a new campaign.
 */
export const createCampaign = async (data) => {
    if (!data.title || !data.goalAmount) {
        throw new Error("Title and goal amount are required");
    }

    // Institutional integrity check Hub
    if (data.createdBy) {
        await ensureNgoApproved(data.createdBy);
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
    // Sync temporal mission lifecycles Hub
    await syncCampaignStatuses();

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

    const campaigns = await campaignRepository.findAll(normalized);
    
    // Bulk Resolve NGOs Hub Hub
    const userIds = [...new Set(campaigns.map(c => c.createdBy?._id || c.createdBy))].filter(Boolean);
    if (userIds.length > 0) {
        const NGOs = await ngoRepository.findAll({ userId: { $in: userIds } });
        const ngoMap = NGOs.reduce((map, ngo) => {
            map[ngo.userId.toString()] = ngo;
            return map;
        }, {});

        return campaigns.map(c => {
            const campaignObj = c.toObject();
            const ngo = ngoMap[(campaignObj.createdBy?._id || campaignObj.createdBy).toString()];
            if (ngo) {
                campaignObj.createdBy = {
                    ...campaignObj.createdBy,
                    organizationName: ngo.organizationName,
                    ngoId: ngo._id,
                    mission: ngo.mission
                };
            }
            return campaignObj;
        });
    }

    return campaigns;
};

export const getMyCampaigns = async (filters = {}, actor) => {
    if (!actor) throw new Error("Unauthorized");

    // Sync temporal mission lifecycles Hub
    await syncCampaignStatuses();

    const query = { isDeleted: false };

    if (actor.role === "ngo-admin") {
        query.createdBy = actor.id;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    return await campaignRepository.findAll(query);
};

/**
 * Get a campaign by its ID.
 */
export const getCampaignById = async (id) => {
    // Sync temporal mission lifecycles Hub
    await syncCampaignStatuses();

    const campaign = await campaignRepository.findById(id);

    if (!campaign) {
        throw new Error("Campaign not found");
    }

    // High-Fidelity NGO Mapping Hub
    const userId = campaign.createdBy?._id || campaign.createdBy;
    if (userId) {
        const ngo = await ngoRepository.findByUserId(userId);
        if (ngo) {
            // Attach NGO details to the response Hub
            const campaignObj = campaign.toObject();
            campaignObj.createdBy = {
                ...campaignObj.createdBy,
                organizationName: ngo.organizationName,
                ngoId: ngo._id,
                mission: ngo.mission
            };
            return campaignObj;
        }
    }

    return campaign;
};

/**
 * Update campaign details.
 */
export const updateCampaign = async (id, data, actor) => {
    const existing = await campaignRepository.findById(id);
    if (!existing) throw new Error("Campaign not found");
    if (!canManageCampaign(existing, actor)) throw new Error("Forbidden");

    // Locked edit check Hub
    if (actor.role === 'ngo-admin') {
        await ensureNgoApproved(actor.id);
    }

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

export const deleteCampaign = async (id, actor) => {
    const campaign = await campaignRepository.findById(id);

    if (!campaign) throw new Error("Mission not found in registry.");

    // Strategic Level Bypass: Allow any authenticated ngo-admin or admin to abort/delete.
    if (!actor || (actor.role !== "admin" && actor.role !== "ngo-admin")) {
        throw new Error("Unauthorized administrative access.");
    }

    if (campaign.status === "active") {
        throw new Error("Active campaigns cannot be deleted");
    }

    return await campaignRepository.softDelete(id);
};

/**
 * Publish a campaign.
 * Business rules:
 *  - Only campaigns in "draft" status can be published.
 *  - Publishing makes the campaign visible and active.
 */
/**
 * Submit a campaign for approval.
 * Business rule: Moves mission from "draft" to "pending".
 */
export const submitCampaign = async (id, actor) => {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) throw new Error("Mission not found");
    if (!canManageCampaign(campaign, actor)) throw new Error("Forbidden");

    // Locked action check Hub
    if (actor.role === 'ngo-admin') {
        await ensureNgoApproved(actor.id);
    }

    if (campaign.status !== "draft") {
        throw new Error("Only proposals can be submitted for review Hub Sycn!");
    }

    return await campaignRepository.updateById(id, { status: "pending" });
};

export const publishCampaign = async (id, actor) => {
    const campaign = await campaignRepository.findById(id);

    if (!campaign) throw new Error("Mission not found in registry.");

    // Mandatory Institutional Oversight Hub
    // Only platform administrators can deploy a mission.
    if (!actor || actor.role !== "admin") {
        throw new Error("Unauthorized administrative access. Campaign deployment requires Platform Admin approval Hub Sync!");
    }

    if (campaign.status !== "draft" && campaign.status !== "pending") {
        console.warn(`[Audit Notice] Mission ${id} is already ${campaign.status}.`);
        throw new Error(`Only proposals can be deployed. Current status: ${campaign.status}`);
    }

    console.info(`[Marketplace Sync] Mission ${id} successfully deployed by ${actor.id}`);
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