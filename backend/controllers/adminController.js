const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const db = require('../models/db');

/**
 * Admin Controller
 * Handles administrative operations with comprehensive logging
 */

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const users = await User.getAllUsers();
    
    // Log the action
    await AdminLog.create(
      req.user.dbUser.id,
      'USER_LIST_VIEW',
      null,
      `Admin ${req.user.email} viewed user list (page ${page}, limit ${limit})`
    );

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: users.length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      error: 'Failed to get users',
      message: error.message
    });
  }
};

/**
 * Update user role (admin only)
 * PUT /api/admin/users/:userId/role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { newRole } = req.body;
    
    if (!newRole) {
      return res.status(400).json({ 
        error: 'Missing role',
        message: 'newRole is required'
      });
    }

    // Validate role
    const validRoles = ['guest', 'user', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        message: `Role must be one of: ${validRoles.join(', ')}`
      });
    }

    // Check if user exists
    const targetUser = await User.getById(userId);
    if (!targetUser) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Target user does not exist'
      });
    }

    // Prevent admin from changing their own role
    if (parseInt(userId) === req.user.dbUser.id) {
      return res.status(400).json({ 
        error: 'Invalid operation',
        message: 'Admin cannot change their own role'
      });
    }

    // Update user role
    await User.updateRole(userId, newRole, req.user.dbUser.id);

    // Log the action
    await AdminLog.create(
      req.user.dbUser.id,
      'ROLE_UPDATE',
      userId,
      `Role changed from ${targetUser.role} to ${newRole} for user ${targetUser.email}`
    );

    res.json({
      success: true,
      message: `User role updated successfully from ${targetUser.role} to ${newRole}`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        oldRole: targetUser.role,
        newRole
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ 
      error: 'Failed to update user role',
      message: error.message
    });
  }
};

/**
 * Delete user (admin only)
 * DELETE /api/admin/users/:userId
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    
    // Check if user exists
    const targetUser = await User.getById(userId);
    if (!targetUser) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'Target user does not exist'
      });
    }

    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user.dbUser.id) {
      return res.status(400).json({ 
        error: 'Invalid operation',
        message: 'Admin cannot delete their own account'
      });
    }

    // Prevent admin from deleting other admins
    if (targetUser.role === 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Cannot delete admin users'
      });
    }

    // Delete user
    await User.deleteUser(userId, req.user.dbUser.id);

    // Log the action
    await AdminLog.create(
      req.user.dbUser.id,
      'USER_DELETE',
      userId,
      `User ${targetUser.email} (${targetUser.role}) deleted by admin`
    );

    res.json({
      success: true,
      message: `User ${targetUser.email} deleted successfully`
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: 'Failed to delete user',
      message: error.message
    });
  }
};

/**
 * Get admin logs (admin only)
 * GET /api/admin/logs
 */
exports.getAdminLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const action = req.query.action || null;
    const adminId = req.query.adminId || null;

    let logs;
    if (action) {
      logs = await AdminLog.getLogsByAction(action, page, limit);
    } else {
      logs = await AdminLog.getLogs(page, limit, adminId);
    }

    // Log the action
    await AdminLog.create(
      req.user.dbUser.id,
      'LOGS_VIEW',
      null,
      `Admin ${req.user.email} viewed admin logs (page ${page}, limit ${limit})`
    );

    res.json({
      success: true,
      logs: logs.logs || logs,
      pagination: logs.pagination || null
    });
  } catch (error) {
    console.error('Get admin logs error:', error);
    res.status(500).json({ 
      error: 'Failed to get admin logs',
      message: error.message
    });
  }
};

/**
 * Get recent admin activity (admin only)
 * GET /api/admin/activity
 */
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const activity = await AdminLog.getRecentActivity(limit);

    res.json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ 
      error: 'Failed to get recent activity',
      message: error.message
    });
  }
};

/**
 * Get user statistics (admin only)
 * GET /api/admin/stats
 */
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.getUserStats();

    // Log the action
    await AdminLog.create(
      req.user.dbUser.id,
      'STATS_VIEW',
      null,
      `Admin ${req.user.email} viewed user statistics`
    );

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      error: 'Failed to get user statistics',
      message: error.message
    });
  }
};

/**
 * Bulk user operations (admin only)
 * POST /api/admin/users/bulk
 */
exports.bulkUserOperations = async (req, res) => {
  try {
    const { operation, userIds, data } = req.body;
    
    if (!operation || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'operation and userIds array are required'
      });
    }

    const validOperations = ['role_update', 'delete'];
    if (!validOperations.includes(operation)) {
      return res.status(400).json({ 
        error: 'Invalid operation',
        message: `Operation must be one of: ${validOperations.join(', ')}`
      });
    }

    let results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const userId of userIds) {
      try {
        if (operation === 'role_update') {
          if (!data || !data.newRole) {
            throw new Error('newRole is required for role_update operation');
          }
          await User.updateRole(userId, data.newRole, req.user.dbUser.id);
          results.push({ userId, status: 'success', message: 'Role updated' });
          successCount++;
        } else if (operation === 'delete') {
          const targetUser = await User.getById(userId);
          if (targetUser && targetUser.role !== 'admin') {
            await User.deleteUser(userId, req.user.dbUser.id);
            results.push({ userId, status: 'success', message: 'User deleted' });
            successCount++;
          } else {
            results.push({ userId, status: 'skipped', message: 'Admin user or user not found' });
          }
        }
      } catch (error) {
        results.push({ userId, status: 'error', message: error.message });
        errorCount++;
      }
    }

    // Log the bulk operation
    await AdminLog.create(
      req.user.dbUser.id,
      'BULK_OPERATION',
      null,
      `Bulk ${operation} on ${userIds.length} users: ${successCount} successful, ${errorCount} failed`
    );

    res.json({
      success: true,
      message: `Bulk operation completed: ${successCount} successful, ${errorCount} failed`,
      results,
      summary: {
        total: userIds.length,
        successful: successCount,
        failed: errorCount
      }
    });
  } catch (error) {
    console.error('Bulk user operations error:', error);
    res.status(500).json({ 
      error: 'Failed to perform bulk operations',
      message: error.message
    });
  }
};

