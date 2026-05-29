const { verifyToken } = require('../utils/token');
const { sendResponse } = require('../utils/response');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, false, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, false, 'Token expired. Please login again.');
    }
    return sendResponse(res, 401, false, 'Invalid token.');
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required.');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(res, 403, false, `Access denied. Required: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`);
    }
    next();
  };
}

module.exports = { authenticate, authorize };
