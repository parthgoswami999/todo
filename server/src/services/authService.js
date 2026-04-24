import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const signToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: '7d'
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  return {
    token: signToken(user._id),
    user: sanitizeUser(user)
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return {
    token: signToken(user._id),
    user: sanitizeUser(user)
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return sanitizeUser(user);
};

export const updateCurrentUser = async (userId, { name, email }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: userId }
  });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  user.name = name.trim();
  user.email = normalizedEmail;
  await user.save();

  return sanitizeUser(user);
};

export const changeCurrentUserPassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.comparePassword(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, 'Old password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return {
    success: true
  };
};
