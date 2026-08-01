// ============================================================
//  models/slotModel.js
//  All SQL queries for the slots table (PostgreSQL)
// ============================================================

import db from '../config/db.js';

// ── Get all slots for a specific date ──
// Returns ALL slots regardless of status (available, booked, blocked)
// Used by: admin slot management page to see full picture of a date
const getSlotsByDate = async (date) => {
   const { rows } = await db.query(
      `SELECT * FROM slots
       WHERE date = $1
       ORDER BY start_time ASC`,
      [date]
   );
   return rows;
};

// ── Get available slots for a date ──
// Only returns slots that still have remaining capacity
// Used by: customer booking page — only show what can actually be booked
const getAvailableSlots = async (date) => {
   const { rows } = await db.query(
      `SELECT * FROM slots
       WHERE date = $1
       AND status = 'available'
       AND booked_count < max_capacity
       ORDER BY start_time ASC`,
      [date]
   );
   return rows;
};

// ── Get single slot by ID ──
// Used by: booking controller (check before booking)
const getSlotById = async (id) => {
   const { rows } = await db.query(
      'SELECT * FROM slots WHERE id = $1',
      [id]
   );
   return rows[0] || null;
};

// ── Bulk insert generated slots ──
// Used by: slotController after slotGenerator creates the array
// PostgreSQL syntax for dynamic bulk insert ($1, $2, $3...), ($4, $5, $6...)
const bulkInsertSlots = async (slots, createdBy) => {
   if (!slots || slots.length === 0) return 0;

   const values = [];
   const valueStrings = [];

   slots.forEach((slot, index) => {
      const offset = index * 7;
      valueStrings.push(
         `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}::slot_status, $${offset + 7})`
      );
      values.push(
         slot.date,
         slot.start_time,
         slot.end_time,
         slot.max_cap,
         0,
         'available',
         createdBy
      );
   });

   const queryText = `
      INSERT INTO slots
      (date, start_time, end_time, max_capacity, booked_count, status, created_by)
      VALUES ${valueStrings.join(', ')}
   `;

   const { rowCount } = await db.query(queryText, values);
   return rowCount;
};

// ── Block a slot ──
// Admin manually blocks a slot — no one can book it
const blockSlot = async (id) => {
   await db.query(
      `UPDATE slots SET status = 'blocked' WHERE id = $1`,
      [id]
   );
};

// ── Delete a slot ──
// Only allowed if slot has no bookings
const deleteSlot = async (id) => {
   const { rowCount } = await db.query(
      'DELETE FROM slots WHERE id = $1 AND booked_count = 0',
      [id]
   );
   return { affectedRows: rowCount };
};

// ── Increment booked count ──
// Called inside booking transaction when a slot is booked
// Also updates status to 'booked' if capacity is now full
const incrementBookedCount = async (id, connection = db) => {
   // Uses passed client for transaction support or defaults to `db`
   await connection.query(
      `UPDATE slots
       SET booked_count = booked_count + 1,
           status = CASE
              WHEN booked_count + 1 >= max_capacity THEN 'booked'::slot_status
              ELSE 'available'::slot_status
           END
       WHERE id = $1`,
      [id]
   );
};

// ── Decrement booked count ──
// Called when a booking is cancelled
// Sets status back to 'available'
const decrementBookedCount = async (id) => {
   await db.query(
      `UPDATE slots
       SET booked_count = GREATEST(booked_count - 1, 0),
           status = 'available'::slot_status
       WHERE id = $1`,
      [id]
   );
};

export {
   getSlotsByDate,
   getAvailableSlots,
   getSlotById,
   bulkInsertSlots,
   blockSlot,
   deleteSlot,
   incrementBookedCount,
   decrementBookedCount
};