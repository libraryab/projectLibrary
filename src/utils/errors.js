/**
 * Error handling utilities for the application
 */

// Custom error class that extends Error
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      status: this.statusCode,
      code: this.errorCode,
      message: this.message,
      timestamp: this.timestamp,
    };
  }
}

// Factory object for creating standardized errors
const errorFactory = {
  validationError: (message) => {
    return new AppError(message, 400, 'VALIDATION_ERROR');
  },

  unauthorized: (message) => {
    return new AppError(message, 401, 'UNAUTHORIZED');
  },

  forbidden: (message) => {
    return new AppError(message, 403, 'FORBIDDEN');
  },

  notFound: (resource) => {
    const message = resource ? `${resource} not found` : 'Resource not found';
    return new AppError(message, 404, 'NOT_FOUND');
  },

  conflict: (message) => {
    return new AppError(message, 409, 'CONFLICT');
  },

  unprocessable: (message) => {
    return new AppError(message, 422, 'UNPROCESSABLE_ENTITY');
  },

  internal: (message) => {
    return new AppError(message, 500, 'INTERNAL_ERROR');
  },
};

module.exports = {
  AppError,
  errorFactory,
};
