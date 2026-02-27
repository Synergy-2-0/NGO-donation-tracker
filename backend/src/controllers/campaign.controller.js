import * as campaignService from "../services/campaign.service.js";

// create campaign
export const createCampaign = async (req, res) => {
    try {
        const campaign = await campaignService.createCampaign(req.body);
        res.status(201).json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// get all campaigns
export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignService.getAllCampaigns();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get single campaign
export const getCampaignById = async (req, res) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.id);
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
            req.body
        );
        res.json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// delete campaign
export const deleteCampaign = async (req, res) => {
    try {
        await campaignService.deleteCampaign(req.params.id);
        res.json({ message: "Campaign archived successfully" });
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
        const campaign = await campaignService.publishCampaign(req.params.id);
        res.json(campaign);
    } catch (error) {
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
