const db = require('../models/db');

/**
 * Set a user as admin by their email
 * Usage: node database/set_admin.js <email>
 */
async function setAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.error('❌ Error: Email address is required');
      console.log('\nUsage: node database/set_admin.js <email>');
      console.log('Example: node database/set_admin.js leojeffin4@gmail.com');
      process.exit(1);
    }

    console.log(`\n🔍 Looking for user with email: ${email}...`);

    // Check if user exists
    const [users] = await db.query(
      'SELECT id, email, role, firebase_uid, created_at FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.error(`\n❌ Error: No user found with email: ${email}`);
      console.log('\n💡 Tips:');
      console.log('  1. Make sure the user has signed up/logged in at least once');
      console.log('  2. Check the email spelling');
      console.log('  3. View all users: node database/list_users.js');
      process.exit(1);
    }

    const user = users[0];
    console.log(`\n✅ User found:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Firebase UID: ${user.firebase_uid}`);
    console.log(`   Created: ${user.created_at}`);

    if (user.role === 'admin') {
      console.log('\n⚠️  This user is already an admin!');
      process.exit(0);
    }

    // Update user role to admin
    await db.query(
      'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
      ['admin', user.id]
    );

    console.log(`\n🎉 Success! ${email} is now an admin!`);
    console.log('\n📝 Role changed: ${user.role} → admin');
    console.log('\n🔐 They can now access:');
    console.log('   - Admin Dashboard (/admin)');
    console.log('   - User Management');
    console.log('   - Quiz Analytics');
    console.log('   - Feedback Management');
    console.log('   - All admin API endpoints');
    console.log('\n⚠️  Note: The user needs to refresh their browser/re-login to see admin features.\n');

  } catch (error) {
    console.error('\n❌ Error setting admin role:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

setAdmin();
