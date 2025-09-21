const admin = require('firebase-admin');
const path = require('path');

// Load Firebase service account
let serviceAccount;
try {
  serviceAccount = require('../firebase-admin-key.json');
} catch (error) {
  console.error('❌ Firebase service account key not found. Please ensure firebase-admin-key.json exists.');
  process.exit(1);
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    process.exit(1);
  }
}

// Export Firebase admin instance
module.exports = admin;