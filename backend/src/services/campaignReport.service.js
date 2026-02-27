import * as reportRepository from "../repository/campaignReport.repository.js";
import Campaign from "../models/campaign.model.js";

/**
 * Create a report for a completed campaign.
 * Business rules:
 *  - Report can only be created for campaigns with status "completed".
 *  - Only one report per campaign is allowed.
 */
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

/**
 * Get the report associated with a campaign.
 */
export const getReportByCampaign = async (campaignId) => {
    const report = await reportRepository.findByCampaign(campaignId);
    if (!report) throw new Error("Report not found");
    return report;
};

/**
 * Get a report by its ID.
 */
export const getReportById = async (id) => {
    const report = await reportRepository.findById(id);
    if (!report) throw new Error("Report not found");
    return report;
};
