const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing Firebase and axios dependencies...');

try {
  // Install Firebase and axios
  execSync('npm install firebase axios', { stdio: 'inherit' });
  
  console.log('✅ Dependencies installed successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Create .env file in frontend/ with:');
  console.log('   REACT_APP_API_URL=http://localhost:3000');
  console.log('');
  console.log('2. Start the backend:');
  console.log('   cd backend && node server.js');
  console.log('');
  console.log('3. Start the React frontend:');
  console.log('   cd frontend/ && npm run dev');
  console.log('');
  console.log('4. Test authentication at: http://localhost:3001');
  
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}
