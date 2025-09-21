# GuardED Backend - Authentication & RBAC System

A comprehensive Node.js backend with Firebase authentication and Role-Based Access Control (RBAC) for the GuardED educational platform.

## 🚀 Features

- **Firebase Authentication**: Email/password, Google OAuth, and anonymous guest sign-in
- **Role-Based Access Control**: Guest, User, and Admin roles with granular permissions
- **MySQL Database**: Persistent user data and admin audit logs
- **Security Middleware**: Rate limiting, CORS, Helmet security headers
- **Comprehensive Logging**: All admin actions are logged for audit purposes
- **Guest User Support**: Anonymous users can browse and convert to registered accounts

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vue)   │◄──►│   (Node.js)     │◄──►│   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   Middleware    │    │   Admin Logs    │
│   Auth          │    │   (Auth/RBAC)   │    │   (Audit Trail) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- Firebase project with Admin SDK
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

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

# Security
JWT_SECRET=your_jwt_secret_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > Service Accounts
4. Generate new private key (download JSON file)
5. Place the JSON file as `firebase-admin-key.json` in the project root
6. Enable Authentication methods:
   - Email/Password
   - Google Sign-in
   - Anonymous Sign-in

### 4. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE guarded_db;
```

2. Run the schema file:
```bash
mysql -u your_username -p guarded_db < database/schema.sql
```

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔐 Authentication Flow

### 1. User Registration/Login
- User signs up/logs in through Firebase
- Frontend receives Firebase ID token
- Backend verifies token and syncs user with MySQL
- User role is determined (guest for anonymous, user for registered)

### 2. Request Authentication
- Frontend includes `Authorization: Bearer <token>` header
- Backend middleware verifies Firebase token
- User data is synced/updated in MySQL
- `req.user` contains Firebase UID and MySQL user data

### 3. Role Verification
- Routes use `requireRole('admin')` middleware
- Middleware checks `req.user.dbUser.role`
- Access granted/denied based on role

## 🛡️ Security Features

- **Never Trust Client Role**: Role is always verified from database
- **Token Validation**: Firebase ID tokens are verified on every request
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: All inputs are validated and sanitized
- **Audit Logging**: All admin actions are logged with timestamps

## 📚 API Endpoints

### Authentication Routes (`/api/users`)

| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| POST | `/guest` | ❌ | ❌ | Create anonymous guest user |
| POST | `/verify-token` | ❌ | ❌ | Verify Firebase token |
| GET | `/profile` | ✅ | Any | Get user profile |
| PUT | `/profile` | ✅ | Any | Update user profile |
| POST | `/convert-guest` | ✅ | Guest | Convert guest to user |
| POST | `/from-google-form` | ❌ | ❌ | ~~Removed~~ |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/users` | ✅ | Admin | List all users |
| PUT | `/users/:id/role` | ✅ | Admin | Update user role |
| DELETE | `/users/:id` | ✅ | Admin | Delete user |
| POST | `/users/bulk` | ✅ | Admin | Bulk user operations |
| GET | `/logs` | ✅ | Admin | View admin logs |
| GET | `/activity` | ✅ | Admin | Recent activity |
| GET | `/stats` | ✅ | Admin | User statistics |

## 🔄 Example API Usage

### 1. Create Guest User

```bash
curl -X POST http://localhost:3000/api/users/guest
```

Response:
```json
{
  "success": true,
  "message": "Guest user created successfully",
  "user": {
    "uid": "anonymous_uid_123",
    "role": "guest",
    "customToken": "firebase_custom_token"
  }
}
```

### 2. Authenticate User

```bash
curl -X POST http://localhost:3000/api/users/verify-token \
  -H "Content-Type: application/json" \
  -d '{"idToken": "firebase_id_token_here"}'
```

### 3. Access Protected Route

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer firebase_id_token_here"
```

### 4. Admin Operations

```bash
# Update user role
curl -X PUT http://localhost:3000/api/admin/users/123/role \
  -H "Authorization: Bearer admin_firebase_token" \
  -H "Content-Type: application/json" \
  -d '{"newRole": "admin"}'

# View admin logs
curl -X GET http://localhost:3000/api/admin/logs \
  -H "Authorization: Bearer admin_firebase_token"
```

## 🧪 Testing

### Test Authentication Flow

1. **Create Guest User**:
   ```bash
   curl -X POST http://localhost:3000/api/users/guest
   ```

2. **Verify Token** (use token from step 1):
   ```bash
   curl -X POST http://localhost:3000/api/users/verify-token \
     -H "Content-Type: application/json" \
     -d '{"idToken": "your_token_here"}'
   ```

3. **Access Protected Route**:
   ```bash
   curl -X GET http://localhost:3000/api/users/profile \
     -H "Authorization: Bearer your_token_here"
   ```

### Test Role-Based Access

1. **Try Admin Route as Regular User** (should fail):
   ```bash
   curl -X GET http://localhost:3000/api/admin/users \
     -H "Authorization: Bearer user_token_here"
   ```

2. **Try Admin Route as Admin** (should succeed):
   ```bash
   curl -X GET http://localhost:3000/api/admin/users \
     -H "Authorization: Bearer admin_token_here"
   ```

## 🚨 Security Notes

### Critical Security Practices

1. **Never Trust Client-Side Role**: Always verify role from database
2. **Validate All Inputs**: Sanitize and validate all request data
3. **Use HTTPS in Production**: Never send tokens over HTTP
4. **Rotate Secrets Regularly**: Change JWT secrets and Firebase keys periodically
5. **Monitor Admin Logs**: Regularly review admin action logs
6. **Limit Admin Access**: Only grant admin role to trusted users

### Firebase Security Rules

Ensure your Firebase project has proper security rules:

```javascript
// Example Firebase Auth rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Failed**:
   - Check `firebase-admin-key.json` exists and is valid
   - Verify Firebase project ID matches configuration

2. **Database Connection Failed**:
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

3. **Authentication Errors**:
   - Verify Firebase token is valid and not expired
   - Check user exists in MySQL database
   - Ensure proper Authorization header format

4. **Role Access Denied**:
   - Verify user role in database
   - Check middleware configuration
   - Ensure route protection is properly set

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=* npm run dev
```

## 📝 Development

### Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Authentication and RBAC middleware
├── models/          # Database models
├── routes/          # API route definitions
├── utils/           # Utility functions
├── database/        # Database schema and migrations
├── server.js        # Main application entry point
└── package.json     # Dependencies and scripts
```

### Adding New Routes

1. Create controller in `controllers/`
2. Define routes in `routes/`
3. Apply appropriate middleware (auth, role)
4. Add to `server.js`

### Adding New Roles

1. Update `roleMiddleware.js` with new role logic
2. Modify database schema if needed
3. Update admin controller for role management
4. Test with proper authentication

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper testing
4. Submit pull request with description

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Firebase and MySQL documentation

---

**⚠️ Important**: This is a production-ready authentication system. Always test thoroughly in development before deploying to production.

