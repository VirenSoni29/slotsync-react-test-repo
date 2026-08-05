import * as slotModel from '../models/slotModel.js';
import * as businessModel from '../models/businessModel.js';
import { generateSlots } from '../utils/slotGenerator.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ============================================================
//  GET /api/slots?date=2025-02-10&business_id=1
// ============================================================
const getAvailableSlots = async (req, res, next) => {
   try {
      const { date, business_id } = req.query;

      if (!date) {
         return sendError(res, 'Date is required as a query parameter', 400);
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
         return sendError(res, 'Date must be in YYYY-MM-DD format.', 400);
      }

      const slots = await slotModel.getAvailableSlots(date, business_id ? parseInt(business_id) : null);
      return sendSuccess(res, 'Available slots fetched.', slots);

   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/slots/admin?date=2025-02-10
// ============================================================
const getAllSlotsByDate = async (req, res, next) => {
   try {
      const { date, business_id } = req.query;

      if (!date) {
         return sendError(res, 'Date is required as a query parameter.', 400);
      }

      let targetBusinessId = business_id ? parseInt(business_id) : req.business?.id;
      if (!targetBusinessId && req.user?.id) {
         const userBiz = await businessModel.getBusinessByOwnerId(req.user.id);
         if (userBiz) targetBusinessId = userBiz.id;
      }

      const slots = await slotModel.getSlotsByDate(date, targetBusinessId);
      return sendSuccess(res, 'Slots fetched.', slots);

   } catch (err) {
      next(err);
   }
};

// ============================================================
//  POST /api/slots/generate
//  Business Owner & Admin — generate slots from a time range
// ============================================================
const generateAndInsertSlots = async (req, res, next) => {
   try {
      const { date, start_time, end_time, duration_min, max_capacity, business_id } = req.body;

      const today = new Date().toISOString().split('T')[0];
      if (date < today) {
         return sendError(res, 'Cannot generate slots for a past date.', 400);
      }

      let targetBusinessId = business_id;
      if (!targetBusinessId && req.business) {
         targetBusinessId = req.business.id;
      }
      if (!targetBusinessId && req.user?.id) {
         const userBiz = await businessModel.getBusinessByOwnerId(req.user.id);
         if (userBiz) targetBusinessId = userBiz.id;
      }

      let slots;
      try {
         slots = generateSlots({ date, start_time, end_time, duration_min, max_capacity });
      } catch (err) {
         return sendError(res, err.message, 400);
      }

      if (slots.length === 0) {
         return sendError(res, 'No slots could be generated from the given time range.', 400);
      }

      const insertedCount = await slotModel.bulkInsertSlots(slots, req.user.id, targetBusinessId);

      return sendSuccess(
         res,
         `${insertedCount} slot(s) generated successfully for your business.`,
         { count: insertedCount, slots },
         201
      );

   } catch (err) {
      next(err);
   }
};

// ============================================================
//  POST /api/slots/block
// ============================================================
const blockSlot = async (req, res, next) => {
   try {
      const { slot_id } = req.body;

      const slot = await slotModel.getSlotById(slot_id);
      if (!slot) {
         return sendError(res, 'Slot not found.', 404);
      }

      if (slot.status === 'blocked') {
         return sendError(res, 'Slot is already blocked.', 400);
      }

      if (slot.booked_count > 0) {
         return sendError(res, 'Cannot block a slot that already has bookings.', 400);
      }

      let targetBusinessId = req.business?.id;
      if (!targetBusinessId && req.user?.id) {
         const userBiz = await businessModel.getBusinessByOwnerId(req.user.id);
         if (userBiz) targetBusinessId = userBiz.id;
      }

      await slotModel.blockSlot(slot_id, targetBusinessId);
      return sendSuccess(res, 'Slot blocked successfully.');

   } catch (err) {
      next(err);
   }
};

// ============================================================
//  DELETE /api/slots/:id
// ============================================================
const deleteSlot = async (req, res, next) => {
   try {
      const { id } = req.params;

      const slot = await slotModel.getSlotById(id);
      if (!slot) {
         return sendError(res, 'Slot not found.', 404);
      }

      let targetBusinessId = req.business?.id;
      if (!targetBusinessId && req.user?.id) {
         const userBiz = await businessModel.getBusinessByOwnerId(req.user.id);
         if (userBiz) targetBusinessId = userBiz.id;
      }

      const result = await slotModel.deleteSlot(id, targetBusinessId);

      if (result.affectedRows === 0) {
         return sendError(res, 'Cannot delete a slot that has existing bookings.', 400);
      }

      return sendSuccess(res, 'Slot deleted successfully.');

   } catch (err) {
      next(err);
   }
};

export {
   getAvailableSlots,
   getAllSlotsByDate,
   generateAndInsertSlots,
   blockSlot,
   deleteSlot
};
