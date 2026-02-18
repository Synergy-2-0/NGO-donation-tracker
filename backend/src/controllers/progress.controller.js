import * as progressService from "../services/progress.service.js";

// create progress
export const createProgress = async (req, res) => {
    try {
        const progress = await progressService.createProgress({
            ...req.body,
            campaign: req.params.id
        });
        res.status(201).json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// get all progress for a campaign
export const getCampaignProgress = async (req, res) => {
    try {
        const progress = await progressService.getCampaignProgress(req.params.id);
        res.json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// update progress
export const updateProgress = async (req, res) => {
    try {
        const progress = await progressService.updateProgress(
            req.params.progressId,
            req.body
        );

        if (!progress) {
            return res.status(404).json({ message: "Progress log not found" });
        }

        res.json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// delete progress
export const deleteProgress = async (req, res) => {
    try {
        const deleted = await progressService.deleteProgress(
            req.params.progressId
        );

        if (!deleted) {
            return res.status(404).json({ message: "Progress log not found" });
        }

        res.json({ message: "Progress log deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
