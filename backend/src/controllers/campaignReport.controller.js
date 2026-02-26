import * as reportService from "../services/campaignReport.service.js";

export const createReport = async (req, res) => {
    try {
        const report = await reportService.createReport(
            req.params.id,
            req.body
        );
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getReportByCampaign = async (req, res) => {
    try {
        const report = await reportService.getReportByCampaign(
            req.params.id
        );
        res.json(report);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getReportById = async (req, res) => {
    try {
        const report = await reportService.getReportById(
            req.params.reportId
        );
        res.json(report);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
