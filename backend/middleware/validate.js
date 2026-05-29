const { sendResponse } = require('../utils/response');

function validateBody(...requiredFields) {
  return (req, res, next) => {
    const missing = requiredFields.filter(
      (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
    );
    if (missing.length > 0) {
      return sendResponse(res, 400, false, `Missing required fields: ${missing.join(', ')}`);
    }
    next();
  };
}

function validateEmail(req, res, next) {
  const { email } = req.body;
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(res, 400, false, 'Invalid email format.');
    }
    req.body.email = email.toLowerCase().trim();
  }
  next();
}

function validatePassword(req, res, next) {
  const { password } = req.body;
  if (password && password.length < 6) {
    return sendResponse(res, 400, false, 'Password must be at least 6 characters.');
  }
  next();
}

module.exports = { validateBody, validateEmail, validatePassword };
