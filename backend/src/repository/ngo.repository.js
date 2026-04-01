import NGO from '../models/ngo.model.js';

export const create = async (data) => {
  return await NGO.create(data);
};

export const findById = async (id) => {
  return await NGO.findById(id).populate('userId', 'name email');
};

export const findByUserId = async (userId) => {
  return await NGO.findOne({ userId }).populate('userId', 'name email');
};

export const findAll = async (filter = {}) => {
  return await NGO.find(filter).populate('userId', 'name email');
};

export const update = async (id, data) => {
  return await NGO.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id) => {
  return await NGO.findByIdAndDelete(id);
};

export const findPublic = async () => {
  return await NGO.find({ status: 'approved', isPublic: true });
};
