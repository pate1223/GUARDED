require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import database connection
const db = require('./models/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 🛡 Security and Middleware
 */

// Helmet security headers (CSP disabled temporarily for Google OAuth)
app.use(helmet({ contentSecurityPolicy: false }));

// CORS for local development
app.use(cors({
  origin: [
    'http://localhost:3000', // Backend
    'http://localhost:3001', // React dev
    'http://localhost:3002', // Alt Vite dev
    'http://localhost:5173', // Vite dev
    'http://localhost:8080'  // Alternate React port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 🚦 Request Logging + Throttling (relaxed for dev)
 */
const requestTimes = new Map();
const THROTTLE_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 50; // dev relaxed

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const clientId = req.ip;
  const now = Date.now();

  // Skip throttle for important endpoints
  if (
    req.path === '/api/config' ||
    req.path === '/health' ||
    req.path.startsWith('/api/quizzes') ||
    req.path.startsWith('/api/users')
  ) {
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
    return next();
  }

  const times = (requestTimes.get(clientId) || []).filter(t => now - t < THROTTLE_WINDOW);
  times.push(now);
  requestTimes.set(clientId, times);

  if (times.length > MAX_REQUESTS_PER_WINDOW) {
    console.log(`🚫 Throttling client ${clientId}`);
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please slow down your requests',
      retryAfter: Math.ceil(THROTTLE_WINDOW / 1000)
    });
  }

  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

/**
 * 💓 Health + Config Endpoints
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    firebaseConfig: {
      apiKey: process.env.FIREBASE_WEB_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    }
  });
});

/**
 * 🧩 API Routes
 */
app.use('/api/users', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/feedback', feedbackRoutes);

/**
 * 🏠 Root + 404 Routes
 */
app.get('/', (req, res) => {
  res.json({
    message: 'GuardED Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/users',
      admin: '/api/admin',
      quizzes: '/api/quizzes',
      feedback: '/api/feedback'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableEndpoints: {
      auth: '/api/users',
      admin: '/api/admin',
      quizzes: '/api/quizzes',
      feedback: '/api/feedback'
    }
  });
});

/**
 * 🧱 Global Error Handling
 */
app.use(errorHandler);

/**
 * 📴 Graceful Shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

/**
 * 🚀 Start Server
 */
const startServer = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL DB connected successfully!');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 GuardED Backend running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Auth: Firebase + MySQL RBAC`);
      console.log(`🌐 CORS enabled for localhost dev ports`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
