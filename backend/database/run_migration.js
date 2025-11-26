const db = require('../models/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Connected to database');

    // Read the migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrate_quiz_history.sql'),
      'utf8'
    );

    // Remove USE guarded_db; as we're already connected
    const cleanSQL = migrationSQL.replace(/USE guarded_db;/g, '');

    // Split by semicolon and execute each statement
    const statements = cleanSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await db.query(statement);
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('The user_progress table now supports:');
    console.log('  - Multiple quiz attempts per user');
    console.log('  - Attempt numbering');
    console.log('  - Percentage tracking');
    console.log('  - Achievement storage');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

runMigration();
