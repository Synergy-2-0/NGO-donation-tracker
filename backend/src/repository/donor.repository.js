import Donor from '../models/donor.model.js';

export const create = async (data) => {
  return await Donor.create(data);
};

export const findAll = async (filters = {}) => {
  return await Donor.find({ ...filters, status: { $ne: 'deleted' } })
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });
};

export const findById = async (id) => {
  return await Donor.findOne({ _id: id, status: { $ne: 'deleted' } })
    .populate('userId', 'name email role');
};

export const findByUserId = async (userId) => {
  return await Donor.findOne({ userId, status: { $ne: 'deleted' } })
    .populate('userId', 'name email role');
};

export const updateById = async (id, data) => {
  return await Donor.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('userId', 'name email role');
};

export const softDelete = async (id) => {
  return await Donor.findByIdAndUpdate(
    id,
    { status: 'deleted' },
    { new: true }
  );
};

// Pledges
export const addPledge = async (donorId, pledgeData) => {
  return await Donor.findByIdAndUpdate(
    donorId,
    { $push: { pledges: pledgeData } },
    { new: true, runValidators: true }
  );
};

export const updatePledge = async (donorId, pledgeId, pledgeData) => {
  const donor = await Donor.findById(donorId);
  if (!donor) throw new Error('Donor not found');

  const pledge = donor.pledges.id(pledgeId);
  if (!pledge) throw new Error('Pledge not found');

  // Update only the fields provided in pledgeData
  Object.keys(pledgeData).forEach(key => {
    pledge[key] = pledgeData[key];
  });

  await donor.save();
  return donor;
};

export const deletePledge = async (donorId, pledgeId) => {
  return await Donor.findByIdAndUpdate(
    donorId,
    { $pull: { pledges: { _id: pledgeId } } },
    { new: true }
  );
};

// Interactions
export const addInteraction = async (donorId, interactionData) => {
  return await Donor.findByIdAndUpdate(
    donorId,
    { $push: { interactions: interactionData } },
    { new: true }
  );
};

export const deleteInteraction = async (donorId, interactionId) => {
  return await Donor.findByIdAndUpdate(
    donorId,
    { $pull: { interactions: { _id: interactionId } } },
    { new: true }
  );
};

// Analytics helpers
export const getSegmentStats = async () => {
  return await Donor.aggregate([
    { $match: { status: { $ne: 'deleted' } } },
    { $group: { _id: '$segment', count: { $sum: 1 }, totalDonated: { $sum: '$analytics.totalDonated' } } }
  ]);
};

export const updateAnalytics = async (id, analyticsData) => {
  return await Donor.findByIdAndUpdate(id, { $set: { analytics: analyticsData } }, { new: true });
};