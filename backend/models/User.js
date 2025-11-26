// models/User.js
const db = require('./db');

class User {
  // Create or update user from Firebase auth
  static async createOrUpdateUser(firebaseUid, email, role = 'user', displayName = null) {
    try {
      console.log('User.createOrUpdateUser called with:', { firebaseUid, email, role, displayName });
      
      // Check if user exists
      const [existingUsers] = await db.query(
        'SELECT * FROM users WHERE firebase_uid = ?',
        [firebaseUid]
      );

      console.log('Existing users found:', existingUsers.length);

      if (existingUsers.length > 0) {
        // Update existing user
        const existingUser = existingUsers[0];
        // Only update user_id if displayName is provided and different from existing
        // Preserve existing user_id if displayName is null/empty
        const userId = displayName && displayName.trim() 
          ? displayName.trim() 
          : (existingUser.user_id || email || firebaseUid);
        
        console.log('Updating existing user with role:', role, 'user_id:', userId);
        await db.query(
          'UPDATE users SET email = ?, role = ?, user_id = ?, updated_at = NOW() WHERE firebase_uid = ?',
          [email, role, userId, firebaseUid]
        );
        
        // Return updated user info
        return {
          ...existingUser,
          email,
          role,
          user_id: userId
        };
      } else {
        // Create new user
        // Use displayName as user_id, fallback to email or firebase_uid
        const userId = displayName && displayName.trim() 
          ? displayName.trim() 
          : (email || firebaseUid);
        
        console.log('Creating new user in database with user_id:', userId);
        const [result] = await db.query(
          'INSERT INTO users (firebase_uid, email, role, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [firebaseUid, email, role, userId]
        );
        
        console.log('User inserted with ID:', result.insertId);
        
        return {
          id: result.insertId,
          firebase_uid: firebaseUid,
          email,
          role,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date()
        };
      }
    } catch (error) {
      console.error('User creation/update error:', error);
      throw new Error(`User creation/update failed: ${error.message}`);
    }
  }

  // Get user by Firebase UID
  static async getByFirebaseUid(firebaseUid) {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE firebase_uid = ?',
        [firebaseUid]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return users[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Update user role (admin only)
  static async updateRole(userId, newRole, adminId) {
    try {
      // Validate role
      const validRoles = ['guest', 'user', 'admin'];
      if (!validRoles.includes(newRole)) {
        throw new Error('Invalid role');
      }

      // Update user role
      await db.query(
        'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
        [newRole, userId]
      );

      // Log the role change
      await db.query(
        'INSERT INTO admin_logs (admin_id, action, target_user_id, details, created_at) VALUES (?, ?, ?, ?, NOW())',
        [adminId, 'ROLE_UPDATE', userId, `Role changed to ${newRole}`]
      );

      return true;
    } catch (error) {
      throw new Error(`Role update failed: ${error.message}`);
    }
  }

  // Get all users (admin only)
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

  // Delete user (admin only)
  static async deleteUser(userId, adminId) {
    try {
      // Check if user exists
      const user = await this.getById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Delete user
      await db.query('DELETE FROM users WHERE id = ?', [userId]);

      // Log the deletion
      await db.query(
        'INSERT INTO admin_logs (admin_id, action, target_user_id, details, created_at) VALUES (?, ?, ?, ?, NOW())',
        [adminId, 'USER_DELETE', userId, `User ${user.email} deleted`]
      );

      return true;
    } catch (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }

  // Get user statistics (admin only)
  static async getUserStats() {
    try {
      const [roleStats] = await db.query(
        'SELECT role, COUNT(*) as count FROM users GROUP BY role'
      );
      
      const [totalUsers] = await db.query('SELECT COUNT(*) as total FROM users');
      
      return {
        roleStats,
        totalUsers: totalUsers[0].total
      };
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }
}

module.exports = User;