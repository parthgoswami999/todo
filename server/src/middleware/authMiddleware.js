import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next({ statusCode: 401, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next({ statusCode: 401, message: 'User no longer exists' });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next({ statusCode: 401, message: 'Invalid or expired token' });
  }
};
