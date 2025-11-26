const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateFeedback() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'backend'
  });

  try {
    console.log('🔄 Starting feedback migration...');

    // Get all feedback entries that have comment but no question2/3/5
    const [feedbackEntries] = await connection.query(`
      SELECT id, comment
      FROM feedback
      WHERE comment IS NOT NULL
        AND (question2 IS NULL OR question3 IS NULL OR question5 IS NULL)
    `);

    console.log(`📊 Found ${feedbackEntries.length} feedback entries to migrate`);

    for (const entry of feedbackEntries) {
      const { id, comment } = entry;

      // Parse the comment to extract individual questions
      let question2 = null;
      let question3 = null;
      let question4 = null;
      let question5 = null;

      if (comment) {
        // Extract "What you liked:"
        const q2Match = comment.match(/What you liked:\s*(.+?)(?=\n\n|$)/s);
        if (q2Match) question2 = q2Match[1].trim();

        // Extract "What to improve:"
        const q3Match = comment.match(/What to improve:\s*(.+?)(?=\n\n|$)/s);
        if (q3Match) question3 = q3Match[1].trim();

        // Extract "Would recommend:"
        const q4Match = comment.match(/Would recommend:\s*(.+?)(?=\n\n|$)/s);
        if (q4Match) question4 = q4Match[1].trim();

        // Extract "Additional comments:"
        const q5Match = comment.match(/Additional comments:\s*(.+?)(?=\n\n|$)/s);
        if (q5Match) question5 = q5Match[1].trim();
      }

      // Update the feedback entry
      await connection.query(`
        UPDATE feedback
        SET question2 = ?, question3 = ?, question4 = ?, question5 = ?
        WHERE id = ?
      `, [question2, question3, question4, question5, id]);

      console.log(`✅ Migrated feedback ID ${id}`);
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run migration
migrateFeedback()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
