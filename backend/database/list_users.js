const db = require('../models/db');

/**
 * List all users in the database with their roles
 * Usage: node database/list_users.js
 */
async function listUsers() {
  try {
    console.log('\n📋 Fetching all users from database...\n');

    const [users] = await db.query(
      'SELECT id, email, role, firebase_uid, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('\n💡 Users are created automatically when they:');
      console.log('   - Sign up through Firebase');
      console.log('   - Log in for the first time');
      console.log('   - Use guest/anonymous mode\n');
      process.exit(0);
    }

    console.log(`✅ Found ${users.length} user(s):\n`);
    console.log('─'.repeat(120));
    console.log(`${'ID'.padEnd(5)} ${'Email'.padEnd(35)} ${'Role'.padEnd(10)} ${'Created'.padEnd(20)} ${'Firebase UID'.padEnd(30)}`);
    console.log('─'.repeat(120));

    users.forEach(user => {
      const roleEmoji = user.role === 'admin' ? '👑' : user.role === 'user' ? '👤' : '🎭';
      const email = user.email.length > 33 ? user.email.substring(0, 30) + '...' : user.email;
      const created = new Date(user.created_at).toLocaleDateString();
      const uid = user.firebase_uid.substring(0, 28) + '...';

      console.log(
        `${String(user.id).padEnd(5)} ${email.padEnd(35)} ${(roleEmoji + ' ' + user.role).padEnd(10)} ${created.padEnd(20)} ${uid}`
      );
    });

    console.log('─'.repeat(120));

    // Show role statistics
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Role Statistics:');
    console.log(`   👑 Admins: ${roleStats.admin || 0}`);
    console.log(`   👤 Users:  ${roleStats.user || 0}`);
    console.log(`   🎭 Guests: ${roleStats.guest || 0}`);
    console.log(`   📈 Total:  ${users.length}`);

    if (!roleStats.admin || roleStats.admin === 0) {
      console.log('\n⚠️  Warning: No admin users found!');
      console.log('   Run: node database/set_admin.js <email> to create an admin\n');
    } else {
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ Error fetching users:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

listUsers();
