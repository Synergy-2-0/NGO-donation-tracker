import milestoneService from '../services/milestone.service.js';

export const createMilestone = async (req, res) => {
  try {
    const milestone = await milestoneService.createMilestone(req.body, req.user);
    res.status(201).json(milestone);
  } catch (error) {
    const status =
      error.message === 'Agreement not found' || error.message === 'Campaign not found' || error.message === 'Milestone not found'
        ? 404
        : error.message === 'Unauthorized'
          ? 403
          : 400;
    res.status(status).json({ message: error.message });
  }
};

export const getMilestones = async (req, res) => {
  try {
    const milestones = await milestoneService.getMilestones({
      agreementId: req.query.agreementId,
      campaignId: req.query.campaignId,
    });
    res.json(milestones);
  } catch (error) {
    const status = error.message === 'agreementId or campaignId query parameter is required' ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const getMilestone = async (req, res) => {
  try {
    const milestone = await milestoneService.getMilestoneById(req.params.id);
    res.json(milestone);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const milestone = await milestoneService.updateMilestone(req.params.id, req.body, req.user);
    res.json(milestone);
  } catch (error) {
    const status =
      error.message === 'Agreement not found' || error.message === 'Campaign not found' || error.message === 'Milestone not found'
        ? 404
        : error.message === 'Unauthorized'
          ? 403
          : 400;
    res.status(status).json({ message: error.message });
  }
};

export const deleteMilestone = async (req, res) => {
  try {
    await milestoneService.deleteMilestone(req.params.id, req.user);
    res.status(204).send();
  } catch (error) {
    const status = error.message === 'Milestone not found' ? 404 : error.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};
