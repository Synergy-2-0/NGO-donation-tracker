import milestoneService from '../services/milestone.service.js';

export const createMilestone = async (req, res) => {
  try {
    const milestone = await milestoneService.createMilestone(req.body);
    res.status(201).json(milestone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMilestones = async (req, res) => {
  try {
    const milestones = await milestoneService.getMilestones(req.query.agreementId);
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const milestone = await milestoneService.updateMilestone(req.params.id, req.body);
    res.json(milestone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMilestone = async (req, res) => {
  try {
    await milestoneService.deleteMilestone(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
