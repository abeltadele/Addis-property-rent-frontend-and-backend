// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Log the error for debugging
  console.error(err.message);

  // Default error status
  let statusCode = 500;
  let message = 'Server Error';

  // Handle specific errors
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;