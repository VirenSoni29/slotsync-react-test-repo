import db from '../config/db.js';

// ── Get all slots for a specific date (optional business_id filter) ──
const getSlotsByDate = async (date, business_id = null) => {
   let query = `SELECT * FROM slots WHERE date = $1`;
   const params = [date];

   if (business_id) {
      query += ` AND business_id = $2`;
      params.push(business_id);
   }

   query += ` ORDER BY start_time ASC`;
   const { rows } = await db.query(query, params);
   return rows;
};

// ── Get available slots for a date (optional business_id filter) ──
const getAvailableSlots = async (date, business_id = null) => {
   let query = `SELECT * FROM slots
                WHERE date = $1
                AND status = 'available'
                AND booked_count < max_capacity`;
   const params = [date];

   if (business_id) {
      query += ` AND business_id = $2`;
      params.push(business_id);
   }

   query += ` ORDER BY start_time ASC`;
   const { rows } = await db.query(query, params);
   return rows;
};

// ── Get single slot by ID ──
const getSlotById = async (id) => {
   const { rows } = await db.query(
      'SELECT * FROM slots WHERE id = $1',
      [id]
   );
   return rows[0] || null;
};

// ── Bulk insert generated slots ──
const bulkInsertSlots = async (slots, createdBy, businessId = null) => {
   if (!slots || slots.length === 0) return 0;

   const values = [];
   const valueStrings = [];

   slots.forEach((slot, index) => {
      const offset = index * 8;
      valueStrings.push(
         `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}::slot_status, $${offset + 7}, $${offset + 8})`
      );
      values.push(
         slot.date,
         slot.start_time,
         slot.end_time,
         slot.max_cap,
         0,
         'available',
         createdBy,
         businessId || slot.business_id || null
      );
   });

   const queryText = `
      INSERT INTO slots
      (date, start_time, end_time, max_capacity, booked_count, status, created_by, business_id)
      VALUES ${valueStrings.join(', ')}
   `;

   const { rowCount } = await db.query(queryText, values);
   return rowCount;
};

// ── Block a slot ──
const blockSlot = async (id, businessId = null) => {
   if (businessId) {
      await db.query(
         `UPDATE slots SET status = 'blocked' WHERE id = $1 AND business_id = $2`,
         [id, businessId]
      );
   } else {
      await db.query(
         `UPDATE slots SET status = 'blocked' WHERE id = $1`,
         [id]
      );
   }
};

// ── Delete a slot ──
const deleteSlot = async (id, businessId = null) => {
   let query = 'DELETE FROM slots WHERE id = $1 AND booked_count = 0';
   const params = [id];

   if (businessId) {
      query += ' AND business_id = $2';
      params.push(businessId);
   }

   const { rowCount } = await db.query(query, params);
   return { affectedRows: rowCount };
};

// ── Increment booked count ──
const incrementBookedCount = async (id, connection = db) => {
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