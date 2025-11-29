const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(authMiddleware);

// Admin role check middleware
const requireAdmin = (req, res, next) => {
  if (req.user.dbUser.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Apply admin check to all routes
router.use(requireAdmin);

// User management routes
router.get('/users', adminUserController.getAllUsers);
router.get('/users/search', adminUserController.searchUsers);
router.get('/users/:userId', adminUserController.getUserById);
router.post('/users', adminUserController.addUser);
router.put('/users/:userId/role', adminUserController.updateUserRole);
router.delete('/users/:userId', adminUserController.deleteUser);

// Admin logs
router.get('/logs', adminUserController.getAdminLogs);

module.exports = router;