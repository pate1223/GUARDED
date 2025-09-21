/**
 * Global Error Handling Middleware
 * Catches and formats all errors thrown in the application
 */

const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('🚨 Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorType = err.name || 'InternalServerError';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorType = 'ValidationError';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    errorType = 'InvalidId';
    message = 'Invalid ID format';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    errorType = 'DuplicateEntry';
    message = 'Resource already exists';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    errorType = 'ForeignKeyConstraint';
    message = 'Referenced resource does not exist';
  } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    errorType = 'ForeignKeyConstraint';
    message = 'Cannot delete resource as it is referenced by other resources';
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    statusCode = 500;
    errorType = 'DatabaseError';
    message = 'Database access denied';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    errorType = 'ServiceUnavailable';
    message = 'Database service unavailable';
  }

  // Firebase Auth specific errors
  if (err.code && err.code.startsWith('auth/')) {
    statusCode = 401;
    errorType = 'AuthenticationError';
    
    switch (err.code) {
      case 'auth/id-token-expired':
        message = 'Authentication token has expired';
        break;
      case 'auth/id-token-revoked':
        message = 'Authentication token has been revoked';
        break;
      case 'auth/invalid-id-token':
        message = 'Invalid authentication token';
        break;
      case 'auth/user-not-found':
        message = 'User not found';
        break;
      case 'auth/user-disabled':
        message = 'User account has been disabled';
        break;
      default:
        message = 'Authentication failed';
    }
  }

  // Development vs Production error details
  const errorResponse = {
    error: {
      type: errorType,
      message: message,
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = err;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

