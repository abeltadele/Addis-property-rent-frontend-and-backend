// JWT token utility functions
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (user, secret, expiresIn) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    secret,
    { expiresIn }
  );
};

module.exports = { generateToken };