const db = require('../models/db');
const admin = require('firebase-admin');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id,
        firebase_uid,
        email,
        user_id as display_name,
        role,
        photo_url,
        language,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    // Get user stats for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const [quizStats] = await db.query(`
        SELECT
          COUNT(*) as quizzes_completed,
          AVG(ROUND((score / max_score) * 100)) as avg_score
        FROM user_progress
        WHERE user_id = ?
      `, [user.id]);

      const [badgeCount] = await db.query(`
        SELECT COUNT(*) as badge_count
        FROM user_badges
        WHERE user_id = ?
      `, [user.id]);

      return {
        ...user,
        stats: {
          quizzes_completed: quizStats[0].quizzes_completed || 0,
          avg_score: Math.round(quizStats[0].avg_score) || 0,
          badges_earned: badgeCount[0].badge_count || 0
        }
      };
    }));

    res.json({
      success: true,
      users: usersWithStats,
      total: usersWithStats.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const [users] = await db.query(`
      SELECT
        id,
        firebase_uid,
        email,
        user_id as display_name,
        role,
        photo_url,
        language,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Get quiz progress
    const [quizProgress] = await db.query(`
      SELECT
        up.quiz_id,
        q.title,
        up.score,
        up.max_score,
        ROUND((up.score / up.max_score) * 100) as percentage,
        up.completed_at
      FROM user_progress up
      JOIN quizzes q ON up.quiz_id = q.id
      WHERE up.user_id = ?
      ORDER BY up.completed_at DESC
    `, [userId]);

    // Get badges
    const [badges] = await db.query(`
      SELECT
        b.name,
        b.description,
        b.icon,
        ub.earned_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ?
      ORDER BY ub.earned_at DESC
    `, [userId]);

    // Get video progress
    const [videoProgress] = await db.query(`
      SELECT
        module_id,
        percentage,
        last_watched
      FROM video_progress
      WHERE user_id = ?
      ORDER BY last_watched DESC
    `, [userId]);

    res.json({
      success: true,
      user: {
        ...user,
        quizProgress,
        badges,
        videoProgress
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    });
  }
};

// Add new user (admin only)
exports.addUser = async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;
    const adminUserId = req.user.dbUser.id;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Validate role
    const validRoles = ['guest', 'user', 'admin'];
    const userRole = role || 'user';
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be guest, user, or admin'
      });
    }

    // Create user in Firebase
    const firebaseUser = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName || email.split('@')[0],
      emailVerified: false
    });

    // Create user in database
    const [result] = await db.query(`
      INSERT INTO users (firebase_uid, email, user_id, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [firebaseUser.uid, email, displayName || email.split('@')[0], userRole]);

    // Log admin action
    await db.query(`
      INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'CREATE_USER', 'user', ?, ?, NOW())
    `, [
      adminUserId,
      result.insertId,
      JSON.stringify({ email, role: userRole, displayName })
    ]);

    res.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: result.insertId,
        firebase_uid: firebaseUser.uid,
        email: email,
        display_name: displayName || email.split('@')[0],
        role: userRole
      }
    });
  } catch (error) {
    console.error('Add user error:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const adminUserId = req.user.dbUser.id;

    // Validate role
    const validRoles = ['guest', 'user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be guest, user, or admin'
      });
    }

    // Check if user exists
    const [users] = await db.query('SELECT id, email, role FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldRole = users[0].role;

    // Update role in database
    await db.query(`
      UPDATE users
      SET role = ?, updated_at = NOW()
      WHERE id = ?
    `, [role, userId]);

    // Log admin action
    await db.query(`
      INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'UPDATE_USER_ROLE', 'user', ?, ?, NOW())
    `, [
      adminUserId,
      userId,
      JSON.stringify({ email: users[0].email, old_role: oldRole, new_role: role })
    ]);

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminUserId = req.user.dbUser.id;

    // Prevent admin from deleting themselves
    if (parseInt(userId) === adminUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Get user details before deletion
    const [users] = await db.query(`
      SELECT id, firebase_uid, email, role
      FROM users
      WHERE id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Delete user data (cascade will handle related records)
      await connection.query('DELETE FROM user_progress WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM video_progress WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM user_badges WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM users WHERE id = ?', [userId]);

      // Delete from Firebase
      if (user.firebase_uid) {
        try {
          await admin.auth().deleteUser(user.firebase_uid);
        } catch (firebaseError) {
          console.error('Firebase deletion error:', firebaseError);
          // Continue even if Firebase deletion fails
        }
      }

      // Log admin action
      await connection.query(`
        INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details, created_at)
        VALUES (?, 'DELETE_USER', 'user', ?, ?, NOW())
      `, [
        adminUserId,
        userId,
        JSON.stringify({ email: user.email, role: user.role })
      ]);

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Search users (admin only)
exports.searchUsers = async (req, res) => {
  try {
    const { query, role, sortBy, order } = req.query;

    let sql = `
      SELECT
        id,
        firebase_uid,
        email,
        user_id as display_name,
        role,
        photo_url,
        created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    // Add search filter
    if (query) {
      sql += ` AND (email LIKE ? OR user_id LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    // Add role filter
    if (role && ['guest', 'user', 'admin'].includes(role)) {
      sql += ` AND role = ?`;
      params.push(role);
    }

    // Add sorting
    const validSortFields = ['email', 'role', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortField} ${sortOrder}`;

    const [users] = await db.query(sql, params);

    res.json({
      success: true,
      users: users,
      total: users.length
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

// Get admin activity logs
exports.getAdminLogs = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const [logs] = await db.query(`
      SELECT
        al.id,
        al.action,
        al.target_type,
        al.target_id,
        al.details,
        al.created_at,
        u.email as admin_email,
        u.user_id as admin_name
      FROM admin_logs al
      LEFT JOIN users u ON al.admin_user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    // Parse JSON details
    const logsWithParsedDetails = logs.map(log => ({
      ...log,
      details: typeof log.details === 'string' ? JSON.parse(log.details) : log.details
    }));

    res.json({
      success: true,
      logs: logsWithParsedDetails,
      total: logs.length
    });
  } catch (error) {
    console.error('Get admin logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin logs',
      error: error.message
    });
  }
};