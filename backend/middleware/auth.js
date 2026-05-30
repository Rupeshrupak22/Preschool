const { verifyAccessToken } = require('../utils/token');
const { sendResponse } = require('../utils/response');
const { isBlacklisted, isUserTokenRevoked } = require('../utils/token-blacklist');
const { validateSession } = require('../utils/sessions');

const ROLE_LEVEL = {
  student: 1,
  teacher: 2,
  principal: 3,
  admin: 4,
};

function tokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return req.cookies?.adyapan_access || req.cookies?.adyapan_token || null;
}

/**
 * Authenticate JWT access token from Authorization header.
 * Checks:
 *   1. Token exists and is valid
 *   2. Token type is 'access' (not refresh)
 *   3. Token is not blacklisted (logout)
 *   4. User hasn't revoked all tokens (logout-all / password change)
 */
function authenticate(req, res, next) {
  const token = tokenFromRequest(req);
  if (!token) {
    return sendResponse(res, 401, false, 'Access denied. No token provided.');
  }

  try {
    const decoded = verifyAccessToken(token);

    // Check if this specific token is blacklisted
    if (decoded.jti && isBlacklisted(decoded.jti)) {
      return sendResponse(res, 401, false, 'Token has been revoked. Please login again.');
    }

    // Check if all user tokens were revoked (password change / logout-all)
    if (decoded.iat && isUserTokenRevoked(decoded.id, decoded.iat)) {
      return sendResponse(res, 401, false, 'Session expired. Please login again.');
    }

    if (!decoded.sid) {
      return sendResponse(res, 401, false, 'Session missing. Please login again.');
    }

    const session = validateSession({ userId: decoded.id, sid: decoded.sid });
    if (!session.valid) {
      return sendResponse(res, 401, false, session.reason);
    }

    req.user = decoded;
    req.session = session.session;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, false, 'Token expired. Please login again.');
    }
    return sendResponse(res, 401, false, 'Invalid token.');
  }
}

/**
 * Role-based authorization middleware.
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required.');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(
        res, 403, false,
        `Access denied. Required: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
      );
    }
    next();
  };
}

function authorizeAtLeast(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required.');
    }

    if ((ROLE_LEVEL[req.user.role] || 0) < (ROLE_LEVEL[minRole] || 0)) {
      return sendResponse(res, 403, false, 'Access denied.');
    }

    next();
  };
}

function canAccessRole(actorRole, targetRole) {
  return (ROLE_LEVEL[actorRole] || 0) >= (ROLE_LEVEL[targetRole] || 0);
}

function requireSameUserOrAtLeast(paramName, minRole) {
  return (req, res, next) => {
    if (!req.user) return sendResponse(res, 401, false, 'Authentication required.');
    if (req.user.id === req.params[paramName]) return next();
    if ((ROLE_LEVEL[req.user.role] || 0) >= (ROLE_LEVEL[minRole] || 0)) return next();
    return sendResponse(res, 403, false, 'Access denied.');
  };
}

module.exports = {
  authenticate,
  authorize,
  authorizeAtLeast,
  canAccessRole,
  requireSameUserOrAtLeast,
  ROLE_LEVEL,
};
