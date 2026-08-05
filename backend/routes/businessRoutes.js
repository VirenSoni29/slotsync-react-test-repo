import { Router } from 'express';
import * as businessController from '../controllers/businessController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { isBusinessOwner, isCustomer } from '../middleware/roleMiddleware.js';

const router = Router();

// Public Routes (Customer Browsing)
router.get('/public', businessController.getPublicBusinesses);
router.get('/public/:identifier', businessController.getPublicBusinessByIdOrSlug);

// Authenticated Routes
router.use(authMiddleware);

// Customer registers a business (Upgrades to business_owner)
router.post('/register', isCustomer, businessController.registerBusiness);

// Business Owner Routes
router.get('/my-profile', isBusinessOwner, businessController.getMyBusiness);
router.put('/my-profile', isBusinessOwner, businessController.updateMyBusiness);
router.get('/dashboard', isBusinessOwner, businessController.getBusinessDashboard);

export default router;
