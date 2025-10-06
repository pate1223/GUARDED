# GuardED Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd frontend/
npm install
```

### 2. Create Environment File
Create a `.env` file in `frontend/` with:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend/Guarded-homepage
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

## 🔧 Troubleshooting

### If you see "process is not defined" error:
- Make sure you're using `import.meta.env.VITE_API_URL` instead of `process.env.REACT_APP_API_URL`
- Restart the development server after creating the .env file

### If the page is blank:
- Check the browser console for errors
- Make sure the backend is running on port 3000
- Verify the .env file is in the correct location

### If Firebase initialization fails:
- Check that your backend .env has all Firebase configuration
- Make sure the backend is running and accessible
- Check the browser console for specific error messages

## 📋 Environment Variables

### Frontend (.env):
```env
VITE_API_URL=http://localhost:3000
```

### Backend (.env):
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=guarded_db

# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id

# Firebase Web App Configuration
FIREBASE_WEB_API_KEY=your_web_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_web_app_id

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

## 🧪 Testing Authentication

1. Start both servers
2. Visit http://localhost:3001
3. Click "Sign in" → "Create Account"
4. Try email registration or Google sign-in
5. Check console for authentication flow logs
