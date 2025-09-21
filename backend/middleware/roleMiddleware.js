/**
 * Role-Based Access Control Middleware
 * Provides comprehensive role checking for route protection
 */

/**
 * Require a specific role
 * @param {string} requiredRole - The role required to access the route
 */
module.exports = function requireRole(requiredRole) {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.dbUser) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'You must be logged in to access this resource'
        });
      }

      // Check if user has the required role
      if (req.user.dbUser.role !== requiredRole) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: `This resource requires ${requiredRole} role. Your current role is ${req.user.dbUser.role}`,
          requiredRole,
          currentRole: req.user.dbUser.role
        });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ 
        error: 'Role verification failed',
        message: 'Internal server error during role verification'
      });
    }
  };
};

/**
 * Require any of the specified roles
 * @param {Array<string>} allowedRoles - Array of roles that can access the route
 */
module.exports.requireAnyRole = function requireAnyRole(allowedRoles) {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.dbUser) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'You must be logged in to access this resource'
        });
      }

      // Check if user has any of the allowed roles
      if (!allowedRoles.includes(req.user.dbUser.role)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: `This resource requires one of these roles: ${allowedRoles.join(', ')}. Your current role is ${req.user.dbUser.role}`,
          allowedRoles,
          currentRole: req.user.dbUser.role
        });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ 
        error: 'Role verification failed',
        message: 'Internal server error during role verification'
      });
    }
  };
};

/**
 * Require admin role (shorthand)
 */
module.exports.requireAdmin = module.exports('admin');

/**
 * Require user or admin role (shorthand)
 */
module.exports.requireUserOrAdmin = module.exports.requireAnyRole(['user', 'admin']);

/**
 * Require authenticated user (any role except guest)
 */
module.exports.requireAuthenticated = (req, res, next) => {
  try {
    // Check if user is authenticated and not anonymous
    if (!req.user || !req.user.dbUser || req.user.dbUser.role === 'guest') {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'This resource requires a registered account. Guest access is not allowed.'
      });
    }

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication verification failed',
      message: 'Internal server error during authentication verification'
    });
  }
};

/**
 * Optional role check - allows access but provides role information
 */
module.exports.optionalRole = (req, res, next) => {
  try {
    if (req.user && req.user.dbUser) {
      // User is authenticated, add role info to response locals
      res.locals.userRole = req.user.dbUser.role;
      res.locals.userId = req.user.dbUser.id;
    } else {
      // User is not authenticated
      res.locals.userRole = 'guest';
      res.locals.userId = null;
    }
    next();
  } catch (error) {
    console.error('Optional role middleware error:', error);
    // Continue without role info on error
    res.locals.userRole = 'guest';
    res.locals.userId = null;
    next();
  }
};