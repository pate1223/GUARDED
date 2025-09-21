const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * Admin Routes
 * All routes require admin authentication and role verification
 */

// Apply authentication and admin role middleware to all admin routes
router.use(authMiddleware);
router.use(roleMiddleware.requireAdmin);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/bulk', adminController.bulkUserOperations);

// Admin logs and monitoring
router.get('/logs', adminController.getAdminLogs);
router.get('/activity', adminController.getRecentActivity);
router.get('/stats', adminController.getUserStats);

module.exports = router;