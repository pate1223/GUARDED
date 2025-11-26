const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkStats() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'backend'
  });

  try {
    console.log('📊 Checking database statistics...\n');

    // Check users
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Total Users: ${users[0].count}`);

    // Check quiz attempts
    const [attempts] = await connection.query('SELECT COUNT(*) as count FROM user_progress');
    console.log(`📝 Total Quiz Attempts: ${attempts[0].count}`);

    // Check feedback
    const [feedback] = await connection.query('SELECT COUNT(*) as count FROM feedback');
    console.log(`💬 Total Feedback Entries: ${feedback[0].count}`);

    // List all users
    console.log('\n👤 All Users:');
    const [userList] = await connection.query('SELECT id, email, role, created_at FROM users');
    userList.forEach(u => {
      console.log(`  - [ID: ${u.id}] ${u.email} (${u.role}) - Created: ${u.created_at}`);
    });

    // Check user_progress entries
    console.log('\n📊 Quiz Attempts by User:');
    const [progressByUser] = await connection.query(`
      SELECT user_id, COUNT(*) as attempts
      FROM user_progress
      GROUP BY user_id
    `);
    progressByUser.forEach(p => {
      console.log(`  - User ID ${p.user_id}: ${p.attempts} attempts`);
    });

    // Check if there are any quizzes
    console.log('\n📚 Quizzes:');
    const [quizzes] = await connection.query('SELECT id, title FROM quizzes');
    quizzes.forEach(q => {
      console.log(`  - [ID: ${q.id}] ${q.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

checkStats();
