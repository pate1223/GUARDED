const mysql = require('mysql2/promise');
require('dotenv').config();

async function listDatabases() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password'
    // NO database specified
  });

  try {
    console.log('📋 Available databases:\n');
    const [databases] = await connection.query('SHOW DATABASES');
    databases.forEach(db => {
      console.log(`  - ${db.Database}`);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

listDatabases();
