// models/User.js
const db = require('./db');

class User {
  /**
   * Create or update a user based on Firebase authentication.
   * IMPORTANT:
   *  - Never overwrite role unless explicitly passed (protect admin role)
   *  - Always keep firebase_uid stable
   *  - user_id = displayName || email || firebaseUid
   */
  static async createOrUpdateUser(firebaseUid, email, role = 'user', displayName = null) {
    try {
      console.log('User.createOrUpdateUser called with:', { firebaseUid, email, role, displayName });

      // Decide user_id (stable identity)
      const userId = (displayName && displayName.trim()) || email || firebaseUid;

      // Check existing user
      const [existingUsers] = await db.query(
        'SELECT * FROM users WHERE firebase_uid = ?',
        [firebaseUid]
      );

      console.log('Existing users found:', existingUsers.length);

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];

        // Preserve role unless this is a brand new explicit override
        const finalRole = existingUser.role || role;

        console.log(
          'Updating existing user:',
          { user_id: userId, roleBefore: existingUser.role, roleAfter: finalRole }
        );

        await db.query(
          `UPDATE users 
           SET email = ?, user_id = ?, updated_at = NOW()
           WHERE firebase_uid = ?`,
          [email, userId, firebaseUid]
        );

        return {
          ...existingUser,
          email,
          user_id: userId,
          role: finalRole
        };
      }

      // Create new user
      console.log('Creating new user in database');

      const [insert] = await db.query(
        `INSERT INTO users (firebase_uid, user_id, email, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [firebaseUid, userId, email, role]
      );

      return {
        id: insert.insertId,
        firebase_uid: firebaseUid,
        user_id: userId,
        email,
        role,
        created_at: new Date(),
        updated_at: new Date()
      };

    } catch (error) {
      console.error('User creation/update error:', error);
      throw new Error(`User creation/update failed: ${error.message}`);
    }
  }

  // Get user by Firebase UID
  static async getByFirebaseUid(firebaseUid) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE firebase_uid = ?',
        [firebaseUid]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  // Get user by database ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Update the user's role (admin only)
   */
  static async updateRole(userId, newRole, adminId) {
    try {
      const validRoles = ['guest', 'user', 'admin'];
      if (!validRoles.includes(newRole)) {
        throw new Error('Invalid role');
      }

      await db.query(
        'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
        [newRole, userId]
      );

      await db.query(
        `INSERT INTO admin_logs (admin_id, action, target_user_id, details, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [adminId, 'ROLE_UPDATE', userId, `Role changed to ${newRole}`]
      );

      return true;
    } catch (error) {
      throw new Error(`Role update failed: ${error.message}`);
    }
  }

  /**
   * Update profile (name → user_id)
   */
  static async updateProfile(userId, displayName) {
    try {
      if (!displayName || displayName.trim() === '') {
        throw new Error('Display name cannot be empty');
      }

      await db.query(
        'UPDATE users SET user_id = ?, updated_at = NOW() WHERE id = ?',
        [displayName.trim(), userId]
      );

      return true;
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  /**
   * Admin: get all users
   */
  static async getAllUsers() {
    try {
      const [rows] = await db.query(
        'SELECT id, firebase_uid, email, role, user_id, created_at, updated_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  /**
   * Admin: delete user
   */
  static async deleteUser(userId, adminId) {
    try {
      const user = await this.getById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await db.query('DELETE FROM users WHERE id = ?', [userId]);

      await db.query(
        `INSERT INTO admin_logs (admin_id, action, target_user_id, details, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [adminId, 'USER_DELETE', userId, `User ${user.email} deleted`]
      );

      return true;
    } catch (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }

  /**
   * Admin: user statistics
   */
  static async getUserStats() {
    try {
      const [roleStats] = await db.query(
        'SELECT role, COUNT(*) as count FROM users GROUP BY role'
      );

      const [total] = await db.query(
        'SELECT COUNT(*) as total FROM users'
      );

      return {
        roleStats,
        totalUsers: total[0].total
      };
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }
}

module.exports = User;
