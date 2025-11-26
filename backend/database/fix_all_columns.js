const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixAllColumns() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'backend'
  });

  try {
    console.log('🔧 Fixing database schema...\n');

    // Add missing columns to feedback table
    console.log('Adding columns to feedback table...');
    try {
      await connection.query(`
        ALTER TABLE feedback
        ADD COLUMN question2 TEXT AFTER comment,
        ADD COLUMN question3 TEXT AFTER question2,
        ADD COLUMN question4 VARCHAR(50) AFTER question3,
        ADD COLUMN question5 TEXT AFTER question4
      `);
      console.log('✅ Added question columns to feedback table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Feedback columns already exist');
      } else {
        console.error('❌ Error adding feedback columns:', err.message);
      }
    }

    // Add missing columns to user_progress table
    console.log('\nAdding columns to user_progress table...');
    try {
      await connection.query(`
        ALTER TABLE user_progress
        ADD COLUMN percentage DECIMAL(5,2) AFTER max_score
      `);
      console.log('✅ Added percentage column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  percentage column already exists');
      } else {
        console.error('❌ Error:', err.message);
      }
    }

    try {
      await connection.query(`
        ALTER TABLE user_progress
        ADD COLUMN attempt_number INT DEFAULT 1 AFTER answers
      `);
      console.log('✅ Added attempt_number column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  attempt_number column already exists');
      } else {
        console.error('❌ Error:', err.message);
      }
    }

    try {
      await connection.query(`
        ALTER TABLE user_progress
        ADD COLUMN achievements JSON AFTER attempt_number
      `);
      console.log('✅ Added achievements column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  achievements column already exists');
      } else {
        console.error('❌ Error:', err.message);
      }
    }

    // Remove the UNIQUE constraint on user_id and quiz_id to allow multiple attempts
    console.log('\nRemoving UNIQUE constraint from user_progress...');
    try {
      await connection.query(`
        ALTER TABLE user_progress
        DROP INDEX unique_user_quiz
      `);
      console.log('✅ Removed UNIQUE constraint - users can now take quizzes multiple times');
    } catch (err) {
      if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('ℹ️  UNIQUE constraint already removed');
      } else {
        console.error('❌ Error:', err.message);
      }
    }

    console.log('\n🎉 Database schema fixed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
}

fixAllColumns();
