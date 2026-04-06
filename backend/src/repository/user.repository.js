import User from "../models/user.model.js";

export const createUser = (data) => User.create(data);

export const findUserByEmail = (email) => User.findOne({ email});

export const findUserById = (id) => User.findById(id);
export const findUserByGoogleId = (googleId) => User.findOne({ googleId });

export const updateUser = (id, data) => User.findByIdAndUpdate(id,data, {new: true});

export const getAllUsers = (filters) => User.find(filters);

export const deactivateUser = (id) => User.findByIdAndUpdate(id, {status: 'inactive'}, {new: true});

