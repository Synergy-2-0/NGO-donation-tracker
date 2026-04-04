import * as campaignService from "../services/campaign.service.js";

// create campaign
export const createCampaign = async (req, res) => {
    try {
        let parsedLocation = req.body.location;

        if (typeof parsedLocation === "string") {
            try {
                parsedLocation = JSON.parse(parsedLocation);
            } catch {
                return res.status(400).json({ message: "Invalid location format. Must be valid JSON." });
            }
        }

        let parsedSdg = req.body.sdgAlignment;
        if (typeof parsedSdg === "string") {
            try {
                parsedSdg = JSON.parse(parsedSdg);
            } catch {
                parsedSdg = [];
            }
        }

        // Parse pledge config from form data
        let parsedPledgeConfig = null;
        if (req.body.pledgeConfig && typeof req.body.pledgeConfig === 'string') {
            try {
                parsedPledgeConfig = JSON.parse(req.body.pledgeConfig);
            } catch {
                parsedPledgeConfig = null;
            }
        }

        const campaignData = {
            ...req.body,
            goalAmount: Number(req.body.goalAmount) || 0,
            targetBeneficiaries: Number(req.body.targetBeneficiaries) || 0,
            location: parsedLocation,
            sdgAlignment: parsedSdg,
            image: req.file?.path?.replace(/\\/g, '/') || null,
            createdBy: req.user.id,
            allowPledges: req.body.allowPledges === 'true',
            ...(parsedPledgeConfig && { pledgeConfig: parsedPledgeConfig }),
        };
        const campaign = await campaignService.createCampaign(campaignData);
        res.status(201).json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// get all campaigns
export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignService.getAllCampaigns(req.query);
        res.json(campaigns);
    } catch (error) {
        const status =
            error.message === 'Both lat and lng are required for radius search' ||
            error.message === 'lat and lng must be valid numbers' ||
            error.message === 'Invalid coordinates' ||
            error.message === 'radius must be between 1 and 500'
                ? 400
                : 500;
        res.status(status).json({ message: error.message });
    }
};

// get single campaign
export const getCampaignById = async (req, res) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.id, req.user);
        res.json(campaign);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// update campaign
export const updateCampaign = async (req, res) => {
    try {
        const campaign = await campaignService.updateCampaign(
            req.params.id,
            req.body,
            req.user
        );
        res.json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// delete campaign
export const deleteCampaign = async (req, res) => {
    try {
        await campaignService.deleteCampaign(req.params.id, req.user);
        res.json({ message: "Campaign archived successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// get campaigns created by the logged-in user
export const getMyCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignService.getMyCampaigns(req.query, req.user);
        res.json(campaigns);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Submit a campaign for approval.
 */
export const submitCampaign = async (req, res) => {
    try {
        const campaign = await campaignService.submitCampaign(req.params.id, req.user);
        res.json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Publish a campaign.
 * Business rule: Only draft campaigns can be published.
 */
export const publishCampaign = async (req, res) => {
    try {
        const campaign = await campaignService.publishCampaign(req.params.id, req.user);
        res.json(campaign);
    } catch (error) {
        console.error(`[Publish Error] Campaign ID: ${req.params.id}`, error);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Get campaign metrics combining financials and progress logs.
 */
export const getCampaignMetrics = async (req, res) => {
    try {
        const metrics = await campaignService.getCampaignMetrics(
            req.params.id
        );
        res.json(metrics);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
