import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/errorMiddleware.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { storeError } from '../utils/storeError.js';
import { signToken } from '../utils/token.js';
import {
  changePasswordValidator,
  loginValidator,
  registerValidator,
  updateProfileValidator
} from '../validators/authValidators.js';

const router = Router();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

router.post(
  '/register',
  registerValidator,
  validateRequest,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        throw new ApiError(409, 'An account with this email already exists');
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          token: signToken(user._id),
          user: sanitizeUser(user)
        }
      });
    } catch (error) {
      await storeError({
        error,
        req,
        apiCode: error.statusCode || 500
      });
      next(error);
    }
  }
);

router.post(
  '/login',
  loginValidator,
  validateRequest,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
      }

      res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          token: signToken(user._id),
          user: sanitizeUser(user)
        }
      });
    } catch (error) {
      await storeError({
        error,
        req,
        apiCode: error.statusCode || 500
      });
      next(error);
    }
  }
);

router.get(
  '/me',
  protect,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      res.json({
        success: true,
        data: sanitizeUser(user)
      });
    } catch (error) {
      await storeError({
        error,
        req,
        apiCode: error.statusCode || 500
      });
      next(error);
    }
  }
);

router.patch(
  '/profile',
  protect,
  updateProfileValidator,
  validateRequest,
  async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const normalizedEmail = email.trim().toLowerCase();
      const user = await User.findById(req.user._id);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user._id }
      });

      if (existingUser) {
        throw new ApiError(409, 'An account with this email already exists');
      }

      user.name = name.trim();
      user.email = normalizedEmail;
      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: sanitizeUser(user)
      });
    } catch (error) {
      await storeError({
        error,
        req,
        apiCode: error.statusCode || 500
      });
      next(error);
    }
  }
);

router.patch(
  '/change-password',
  protect,
  changePasswordValidator,
  validateRequest,
  async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select('+password');

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      const isPasswordValid = await user.comparePassword(oldPassword);

      if (!isPasswordValid) {
        throw new ApiError(400, 'Old password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      await storeError({
        error,
        req,
        apiCode: error.statusCode || 500
      });
      next(error);
    }
  }
);

export default router;
