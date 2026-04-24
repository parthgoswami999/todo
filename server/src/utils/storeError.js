import { ErrorLog } from '../models/ErrorLog.js';

export const storeError = async ({ error, req, apiCode }) => {
  try {
    await ErrorLog.create({
      errorMessage: error.message || 'Internal server error',
      apiCode: apiCode || error.statusCode || 500,
      apiUrl: req.originalUrl,
      userID: req.user?._id ? String(req.user._id) : null
    });
  } catch (loggingError) {
    // eslint-disable-next-line no-console
    console.error('Failed to store error log', loggingError);
  }
};
