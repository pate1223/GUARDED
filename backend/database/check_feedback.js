const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkFeedback() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'backend'
  });

  try {
    console.log('🔍 Checking feedback table structure and data...\n');

    // Check table structure
    const [columns] = await connection.query('DESCRIBE feedback');
    console.log('📋 Feedback table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    console.log('\n📊 Recent feedback entries:');
    const [feedback] = await connection.query(`
      SELECT id, user_id, rating, comment, question2, question3, question4, question5, created_at
      FROM feedback
      ORDER BY created_at DESC
      LIMIT 10
    `);

    feedback.forEach((entry, idx) => {
      console.log(`\n[Entry ${idx + 1}]`);
      console.log(`  ID: ${entry.id}`);
      console.log(`  User ID: ${entry.user_id}`);
      console.log(`  Rating: ${entry.rating}`);
      console.log(`  Question2 (LIKES): ${entry.question2 ? `"${entry.question2}"` : 'NULL'}`);
      console.log(`  Question3 (IMPROVEMENTS): ${entry.question3 ? `"${entry.question3}"` : 'NULL'}`);
      console.log(`  Question5 (OTHER): ${entry.question5 ? `"${entry.question5}"` : 'NULL'}`);
      console.log(`  Comment: ${entry.comment ? `"${entry.comment.substring(0, 100)}..."` : 'NULL'}`);
      console.log(`  Created: ${entry.created_at}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

checkFeedback();
