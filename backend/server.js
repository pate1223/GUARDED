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

// Security middleware with CSP configuration (temporarily disabled for Google OAuth testing)
app.use(helmet({
  contentSecurityPolicy: false
}));

// Rate limiting (disabled for development)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
//   message: {
//     error: 'Too many requests',
//     message: 'Please try again later'
//   }
// });
// app.use(limiter);

// CORS configuration for React development (localhost only)
app.use(cors({
  origin: [
    'http://localhost:3000',     // Backend
    'http://localhost:3001',     // React dev server (common port)
    'http://localhost:5173',     // Vite dev server
    'http://localhost:8080'      // Alternative React port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Note: Static files are now served by React dev server
// app.use(express.static('public'));

// Request throttling middleware (relaxed for development)
const requestTimes = new Map();
const THROTTLE_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 50; // Increased for development

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const clientId = req.ip;
  const now = Date.now();
  
  // Skip throttling for critical endpoints and quiz endpoints
  if (req.path === '/api/config' || 
      req.path === '/health' || 
      req.path.startsWith('/api/quizzes') ||
      req.path.startsWith('/api/users')) {
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
    return next();
  }
  
  // Clean old entries
  if (requestTimes.has(clientId)) {
    const times = requestTimes.get(clientId).filter(time => now - time < THROTTLE_WINDOW);
    requestTimes.set(clientId, times);
  } else {
    requestTimes.set(clientId, []);
  }
  
  // Check if client is making too many requests
  const clientRequests = requestTimes.get(clientId);
  if (clientRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    console.log(`🚫 Throttling client ${clientId} - too many requests`);
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please slow down your requests',
      retryAfter: Math.ceil(THROTTLE_WINDOW / 1000)
    });
  }
  
  // Record this request
  clientRequests.push(now);
  requestTimes.set(clientId, clientRequests);
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Configuration endpoint for frontend
app.get('/api/config', (req, res) => {
  res.json({
    apiUrl: 'http://localhost:3000',
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

// API routes
app.use('/api/users', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root endpoint
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

// 404 handler for undefined routes
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

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const connection = await db.getConnection();
    console.log('✅ MySQL DB connected successfully!');
    connection.release();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 GuardED Backend server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Authentication: Firebase + MySQL RBAC`);
      console.log(`🌐 CORS enabled for: ${process.env.ALLOWED_ORIGINS || 'localhost:3000,3001'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();