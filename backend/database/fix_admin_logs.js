const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixAdminLogs() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'backend'
  });

  try {
    console.log('🔧 Fixing admin_logs table...\n');

    // Add target_user_id column
    try {
      await connection.query(`
        ALTER TABLE admin_logs
        ADD COLUMN target_user_id INT AFTER action
      `);
      console.log('✅ Added target_user_id column to admin_logs table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  target_user_id column already exists');
      } else {
        console.error('❌ Error:', err.message);
      }
    }

    // Add details column
    try {
      await connection.query(`
        ALTER TABLE admin_logs
        ADD COLUMN details TEXT AFTER target_user_id
      `);
      console.log('✅ Added details column to admin_logs table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  details column already exists');
      } else {
        console.error('❌ Error:', err.message);
      }
    }

    // Add created_at column
    try {
      await connection.query(`
        ALTER TABLE admin_logs
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Added created_at column to admin_logs table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  created_at column already exists');
      } else {
        console.error('❌ Error:', err.message);
      }
    }

    // Check if we need to rename admin_user_id to admin_id
    try {
      const [columns] = await connection.query('DESCRIBE admin_logs');
      const hasAdminUserId = columns.some(col => col.Field === 'admin_user_id');
      const hasAdminId = columns.some(col => col.Field === 'admin_id');

      if (hasAdminUserId && !hasAdminId) {
        await connection.query(`
          ALTER TABLE admin_logs
          CHANGE COLUMN admin_user_id admin_id INT NOT NULL
        `);
        console.log('✅ Renamed admin_user_id to admin_id');
      }
    } catch (err) {
      console.error('❌ Error renaming column:', err.message);
    }

    console.log('\n🎉 Admin logs table fixed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
}

fixAdminLogs();
