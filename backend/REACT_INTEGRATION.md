# React Frontend Integration Guide

## 📁 Project Structure

```
your-project/
├── backend/                 # Your current backend
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── ... (all backend files)
└── frontend/               # Your React frontend
    ├── package.json
    ├── src/
    ├── public/
    └── ... (all React files)
```

## 🚀 Development Workflow

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 2. Frontend Setup (in separate terminal)
```bash
cd frontend
npm install
npm run dev
```

### 3. No ngrok needed for localhost development

## 🔧 Environment Configuration

### Backend `.env` file:
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

# Note: ngrok removed for localhost-only development
# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:8080

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend Environment Variables
Create a `.env` file in your React frontend:

```env
# Backend API URL (for localhost development)
REACT_APP_API_URL=http://localhost:3000
```

## 🔗 API Integration

### 1. API Base URL
Your React app should use the backend API URL:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

### 2. Firebase Configuration
The backend provides Firebase config via `/api/config` endpoint:
```javascript
// Fetch Firebase config from backend
const response = await fetch(`${API_BASE_URL}/api/config`);
const { firebaseConfig } = await response.json();
```

### 3. Authentication Flow
1. **Register**: `POST /api/users/register`
2. **Login**: Firebase handles authentication
3. **Profile**: `GET /api/users/profile` (with Firebase token)

## 🐛 Common Issues & Solutions

### CORS Errors
- Backend is configured to allow React dev server ports
- Check that your React app is running on allowed ports (3001, 5173, 8080)

### API Connection Issues
- Ensure backend is running on port 3000
- Check that `REACT_APP_API_URL` is correctly set to `http://localhost:3000`

### Firebase Configuration
- Get Firebase web config from Firebase Console
- Update backend `.env` with Firebase web app credentials
- Ensure authorized domains include `localhost` for development

## 📝 Development Commands

### Terminal 1 (Backend):
```bash
cd backend
node server.js
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Terminal 3 (No ngrok needed for localhost):
```bash
# No additional terminal needed for localhost development
```

## 🔄 Port Configuration

- **Backend**: Port 3000
- **React Dev Server**: Usually port 3001, 5173, or 8080

## 🚨 Important Notes

1. **Localhost Only**: No ngrok needed for localhost development
2. **Firebase Domains**: Add `localhost` to Firebase authorized domains for development
3. **CORS**: Backend allows multiple React dev server ports
4. **API Calls**: React app should call backend API at `http://localhost:3000`

## 🧪 Testing Authentication

1. Start backend: `node server.js`
2. Start React: `npm run dev`
3. Test authentication flow in React app at `http://localhost:3001` (or your React dev server port)
