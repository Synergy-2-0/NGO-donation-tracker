import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repository/user.repository.js';

const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1d';

// helper to create token payload and sign
const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

export const registerUser = async (data) => {
  const { name, email, password, role } = data;

  const existing = await userRepo.findUserByEmail(email);
  if (existing) {
    throw new Error('Email already in use');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser({ name, email, password: hashed, role });
  return user; // controller already returns 201 with user
};

export const loginUser = async (email, password) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid credentials');
  }

  const token = signToken(user);
  return { message: 'Login successful', token };
};

export const getUsers = async (filters = {}) => {
  return await userRepo.getAllUsers(filters);
};

export const updateUser = async (id, data) => {
  // prevent password updates via this endpoint
  if (data.password) delete data.password;
  const user = await userRepo.updateUser(id, data);
  if (!user) throw new Error('User not found');
  return user;
};

export const deactivateUser = async (id) => {
  const user = await userRepo.deactivateUser(id);
  if (!user) throw new Error('User not found');
  return user;
};
