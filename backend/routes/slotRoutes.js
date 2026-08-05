import { Router } from 'express';
import * as slotController from '../controllers/slotController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { isBusinessOwner } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { generateSlotsSchema, blockSlotSchema } from '../validations/slotValidation.js';

const router = Router();

// ── Public ──
router.get('/', slotController.getAvailableSlots);

// ── Business Owner & Admin routes ──
router.get('/admin',
   authMiddleware,
   isBusinessOwner,
   slotController.getAllSlotsByDate
);

router.post('/generate',
   authMiddleware,
   isBusinessOwner,
   validate(generateSlotsSchema),
   slotController.generateAndInsertSlots
);

router.post('/block',
   authMiddleware,
   isBusinessOwner,
   validate(blockSlotSchema),
   slotController.blockSlot
);

router.delete('/:id',
   authMiddleware,
   isBusinessOwner,
   slotController.deleteSlot
);

export default router;
