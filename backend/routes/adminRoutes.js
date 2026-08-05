import { Router } from 'express';

import * as adminController from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Apply auth and admin check to all admin routes
router.use(authMiddleware);
router.use(isAdmin);

// ── Platform Analytics ──
router.get('/analytics', adminController.getAnalytics);
router.get('/peak-hours', adminController.getPeakHours);
router.get('/popular-services', adminController.getPopularServices);
router.get('/recent-bookings', adminController.getRecentBookings);
router.get('/revenue-by-day', adminController.getRevenueByDay);

// ── User Management ──
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);

// ── Global Transactions Ledger ──
router.get('/transactions', adminController.getAllTransactions);

export default router;