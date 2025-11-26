const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifySchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'backend'
  });

  try {
    console.log(`🔍 Verifying schema for database: ${process.env.DB_NAME || 'backend'}\n`);

    // Check feedback table
    console.log('📋 FEEDBACK TABLE COLUMNS:');
    const [feedbackColumns] = await connection.query('DESCRIBE feedback');
    feedbackColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    const feedbackHasQuestion2 = feedbackColumns.some(col => col.Field === 'question2');
    const feedbackHasQuestion3 = feedbackColumns.some(col => col.Field === 'question3');
    const feedbackHasQuestion4 = feedbackColumns.some(col => col.Field === 'question4');
    const feedbackHasQuestion5 = feedbackColumns.some(col => col.Field === 'question5');

    console.log('\n📊 Feedback table status:');
    console.log(`  question2: ${feedbackHasQuestion2 ? '✅' : '❌ MISSING'}`);
    console.log(`  question3: ${feedbackHasQuestion3 ? '✅' : '❌ MISSING'}`);
    console.log(`  question4: ${feedbackHasQuestion4 ? '✅' : '❌ MISSING'}`);
    console.log(`  question5: ${feedbackHasQuestion5 ? '✅' : '❌ MISSING'}`);

    // Check user_progress table
    console.log('\n📋 USER_PROGRESS TABLE COLUMNS:');
    const [progressColumns] = await connection.query('DESCRIBE user_progress');
    progressColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    const progressHasPercentage = progressColumns.some(col => col.Field === 'percentage');
    const progressHasAttemptNumber = progressColumns.some(col => col.Field === 'attempt_number');
    const progressHasAchievements = progressColumns.some(col => col.Field === 'achievements');

    console.log('\n📊 User_progress table status:');
    console.log(`  percentage: ${progressHasPercentage ? '✅' : '❌ MISSING'}`);
    console.log(`  attempt_number: ${progressHasAttemptNumber ? '✅' : '❌ MISSING'}`);
    console.log(`  achievements: ${progressHasAchievements ? '✅' : '❌ MISSING'}`);

    // Check users table
    console.log('\n📋 USERS TABLE COLUMNS:');
    const [usersColumns] = await connection.query('DESCRIBE users');
    usersColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    const usersHasUpdatedAt = usersColumns.some(col => col.Field === 'updated_at');
    console.log(`\n📊 Users table status:`);
    console.log(`  updated_at: ${usersHasUpdatedAt ? '✅' : '❌ MISSING'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

verifySchema();
