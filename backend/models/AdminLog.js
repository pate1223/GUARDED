const db = require('./db');

class AdminLog {
  // Create admin log entry
  static async create(adminId, action, targetUserId = null, details = null) {
    try {
      const [result] = await db.query(
        'INSERT INTO admin_logs (admin_id, action, target_user_id, details, created_at) VALUES (?, ?, ?, ?, NOW())',
        [adminId, action, targetUserId, details]
      );
      
      return {
        id: result.insertId,
        admin_id: adminId,
        action,
        target_user_id: targetUserId,
        details,
        created_at: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to create admin log: ${error.message}`);
    }
  }

  // Get admin logs with pagination
  static async getLogs(page = 1, limit = 50, adminId = null) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT al.*, u.email as admin_email, tu.email as target_user_email
        FROM admin_logs al
        LEFT JOIN users u ON al.admin_id = u.id
        LEFT JOIN users tu ON al.target_user_id = tu.id
      `;
      
      const params = [];
      if (adminId) {
        query += ' WHERE al.admin_id = ?';
        params.push(adminId);
      }
      
      query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [logs] = await db.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM admin_logs';
      if (adminId) {
        countQuery += ' WHERE admin_id = ?';
      }
      const [countResult] = await db.query(countQuery, adminId ? [adminId] : []);
      
      return {
        logs,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get admin logs: ${error.message}`);
    }
  }

  // Get logs by action type
  static async getLogsByAction(action, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const [logs] = await db.query(
        `SELECT al.*, u.email as admin_email, tu.email as target_user_email
         FROM admin_logs al
         LEFT JOIN users u ON al.admin_id = u.id
         LEFT JOIN users tu ON al.target_user_id = tu.id
         WHERE al.action = ?
         ORDER BY al.created_at DESC
         LIMIT ? OFFSET ?`,
        [action, limit, offset]
      );
      
      return logs;
    } catch (error) {
      throw new Error(`Failed to get logs by action: ${error.message}`);
    }
  }

  // Get recent activity summary
  static async getRecentActivity(limit = 10) {
    try {
      const [logs] = await db.query(
        `SELECT al.*, u.email as admin_email, tu.email as target_user_email
         FROM admin_logs al
         LEFT JOIN users u ON al.admin_id = u.id
         LEFT JOIN users tu ON al.target_user_id = tu.id
         ORDER BY al.created_at DESC
         LIMIT ?`,
        [limit]
      );
      
      return logs;
    } catch (error) {
      throw new Error(`Failed to get recent activity: ${error.message}`);
    }
  }
}

module.exports = AdminLog;

