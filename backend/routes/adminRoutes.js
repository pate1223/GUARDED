const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * ADMIN ROUTES
 * All routes require authentication AND Admin role
 */

// Apply authentication and admin role checks to ALL admin routes
router.use(authMiddleware);               // verifies Firebase token
router.use(roleMiddleware.requireAdmin);  // ensures role = admin

/* ------------------------------------------
   DASHBOARD STATS  (NEEDED BY YOUR FRONTEND)
   GET /api/admin/dashboard-stats
------------------------------------------- */
router.get('/dashboard-stats', dashboardController.getDashboardStats);

/* ------------------------------------------
   USER MANAGEMENT
------------------------------------------- */
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/bulk', adminController.bulkUserOperations);

/* ------------------------------------------
   ADMIN LOGS / ACTIVITY
------------------------------------------- */
router.get('/logs', adminController.getAdminLogs);
router.get('/activity', adminController.getRecentActivity);
router.get('/stats', adminController.getUserStats);

module.exports = router;
