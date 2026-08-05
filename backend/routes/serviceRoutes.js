import { Router } from 'express';
import * as serviceController from '../controllers/serviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { isBusinessOwner } from '../middleware/roleMiddleware.js';

const router = Router();

// ── Public routes ──
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// ── Business Owner & Admin routes ──
router.post('/', authMiddleware, isBusinessOwner, serviceController.createService);
router.put('/:id', authMiddleware, isBusinessOwner, serviceController.updateService);
router.delete('/:id', authMiddleware, isBusinessOwner, serviceController.deleteService);

export default router;
