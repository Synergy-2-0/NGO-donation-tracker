import * as reportRepository from "../repository/campaignReport.repository.js";
import Campaign from "../models/campaign.model.js";

export const createReport = async (campaignId, data) => {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) throw new Error("Campaign not found");

    if (campaign.status !== "completed")
        throw new Error("Report can only be created for completed campaigns");

    const existingReport = await reportRepository.findByCampaign(campaignId);
    if (existingReport)
        throw new Error("Report already exists for this campaign");

    return await reportRepository.create({
        ...data,
        campaign: campaignId,
    });
};

export const getReportByCampaign = async (campaignId) => {
    const report = await reportRepository.findByCampaign(campaignId);
    if (!report) throw new Error("Report not found");
    return report;
};

export const getReportById = async (id) => {
    const report = await reportRepository.findById(id);
    if (!report) throw new Error("Report not found");
    return report;
};
