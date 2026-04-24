import { asyncHandler } from '../utils/asyncHandler.js';
import {
  changeCurrentUserPassword,
  getCurrentUser,
  loginUser,
  registerUser,
  updateCurrentUser
} from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: result
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.json({
    success: true,
    message: 'Logged in successfully',
    data: result
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);

  res.json({
    success: true,
    data: user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateCurrentUser(req.user._id, req.body);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  await changeCurrentUserPassword(req.user._id, req.body);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});
