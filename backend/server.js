require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import database connection
const db = require('./models/db');

// Import ONLY the routes that do NOT require authentication
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 🛡 Security + Middleware
 */
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 💓 Health Route
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * ⚙️ Frontend Config (Firebase removed)
 */
app.get('/api/config', (req, res) => {
  res.json({
    apiUrl: process.env.GUARDED_API_URL || `http://localhost:${PORT}`,
    firebaseConfig: null,   // ⛔ Firebase disabled
  });
});

/**
 * 🧩 API Routes (NO AUTH)
 */
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/feedback', feedbackRoutes);

/**
 * 🏠 Root + 404
 */
app.get('/', (req, res) => {
  res.json({
    message: "GuardED Backend API (No Authentication Mode)",
    version: "1.0.0",
    auth: "disabled",
    endpoints: {
      admin: "/api/admin",
      quizzes: "/api/quizzes",
      feedback: "/api/feedback"
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: "Route not found",
    route: req.originalUrl,
  });
});

/**
 * 🧱 Global Error Handler
 */
app.use(errorHandler);

/**
 * 🚀 Start Server
 */
const startServer = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL connected!");
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 GuardED backend running on port ${PORT}`);
      console.log(`🔐 Authentication: DISABLED`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
