const { verifyAccessToken } = require('../utils/token');
const { sendResponse } = require('../utils/response');
const { isBlacklisted, isUserTokenRevoked } = require('../utils/token-blacklist');
const { validateSession } = require('../utils/sessions');
const { logSuspiciousActivity } = require('../utils/security-logger');

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
async function authenticate(req, res, next) {
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

    const session = await validateSession({ userId: decoded.id, sid: decoded.sid });
    if (!session.valid) {
      return sendResponse(res, 401, false, session.reason);
    }

    // ─── Session Hijacking Detection ─────────────────────────────────
    // Compare User-Agent to detect stolen tokens used from a different browser.
    // IP is NOT checked here because it changes legitimately (WiFi→4G, VPN).
    // The full fingerprint (with IP) is still used at login time for bot detection.
    if (session.session.userAgent) {
      const storedUA = session.session.userAgent;
      const currentUA = req.get('user-agent') || '';
      if (currentUA && storedUA !== currentUA) {
        logSuspiciousActivity({
          email: decoded.email,
          userId: decoded.id,
          ip: req.ip || req.connection?.remoteAddress || 'unknown',
          userAgent: currentUA,
          details: `Session hijacking attempt. User-Agent mismatch. Stored: "${storedUA.slice(0, 50)}...", Current: "${currentUA.slice(0, 50)}..."`,
        });
        return sendResponse(res, 401, false, 'Session fingerprint mismatch. Please login again.');
      }
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
 * Prevents both vertical and horizontal privilege escalation.
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required.');
    }

    // Strict role check — token role must exactly match one of the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(
        res, 403, false,
        'Access denied. You do not have permission to access this resource.'
      );
    }
    next();
  };
}

/**
 * Minimum role level authorization.
 * Prevents vertical privilege escalation (lower role accessing higher-level routes).
 */
function authorizeAtLeast(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required.');
    }

    if ((ROLE_LEVEL[req.user.role] || 0) < (ROLE_LEVEL[minRole] || 0)) {
      return sendResponse(res, 403, false, 'Access denied. Insufficient privileges.');
    }

    next();
  };
}

/**
 * Check if actor role can access target role's data.
 * Prevents horizontal privilege escalation (same-level cross-account access).
 */
function canAccessRole(actorRole, targetRole) {
  return (ROLE_LEVEL[actorRole] || 0) >= (ROLE_LEVEL[targetRole] || 0);
}

/**
 * Allow same user OR a user with at least minRole.
 * Prevents horizontal privilege escalation (user A accessing user B's data).
 */
function requireSameUserOrAtLeast(paramName, minRole) {
  return (req, res, next) => {
    if (!req.user) return sendResponse(res, 401, false, 'Authentication required.');

    // Same user — always allowed
    if (req.user.id === req.params[paramName]) return next();

    // Higher role — allowed if they meet the minimum
    if ((ROLE_LEVEL[req.user.role] || 0) >= (ROLE_LEVEL[minRole] || 0)) return next();

    return sendResponse(res, 403, false, 'Access denied. You can only access your own data.');
  };
}

/**
 * Prevent students from accessing teacher/principal/admin data.
 * Prevent teachers from accessing principal/admin data.
 * Enforce strict downward-only data access.
 *
 * Usage: router.get('/students', authenticate, enforceRoleHierarchy('teacher'), ...)
 * Means: only teacher and above can access this route.
 */
function enforceRoleHierarchy(minimumRole) {
  return authorizeAtLeast(minimumRole);
}

/**
 * Prevent cross-school data access for principals and teachers.
 * They can only access data belonging to their own school.
 */
function requireSameSchool(getSchoolId) {
  return (req, res, next) => {
    if (!req.user) return sendResponse(res, 401, false, 'Authentication required.');

    // Admins bypass school restriction
    if (req.user.role === 'admin') return next();

    const userSchoolId = req.user.school_id;
    const resourceSchoolId = typeof getSchoolId === 'function'
      ? getSchoolId(req)
      : req.params[getSchoolId] || req.query[getSchoolId] || req.body[getSchoolId];

    if (!userSchoolId || !resourceSchoolId) {
      return sendResponse(res, 403, false, 'Access denied. School context missing.');
    }

    if (String(userSchoolId) !== String(resourceSchoolId)) {
      return sendResponse(res, 403, false, 'Access denied. You can only access data from your own school.');
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
  authorizeAtLeast,
  canAccessRole,
  requireSameUserOrAtLeast,
  enforceRoleHierarchy,
  requireSameSchool,
  ROLE_LEVEL,
};
