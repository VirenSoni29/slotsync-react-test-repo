import db from '../config/db.js';

// ── Create a booking ──
const createBooking = async (connection, { user_id, service_id, slot_id, business_id, notes }) => {
   const { rows } = await connection.query(
      `INSERT INTO bookings (user_id, service_id, slot_id, business_id, status, payment_status, notes)
       VALUES ($1, $2, $3, $4, 'pending'::booking_status, 'pending'::payment_status, $5)
       RETURNING id`,
      [user_id, service_id, slot_id, business_id || null, notes || null]
   );
   return rows[0].id;
};

// ── Get booking by ID ──
const getBookingById = async (id) => {
   const { rows } = await db.query(
      `SELECT
         b.id,
         b.status,
         b.payment_status,
         b.notes,
         b.reminder_day_before_sent,
         b.reminder_same_day_sent,
         b.created_at,
         b.updated_at,
         b.business_id,
         u.id         AS user_id,
         u.name       AS user_name,
         u.email      AS user_email,
         u.phone      AS user_phone,
         s.id         AS service_id,
         s.service_name,
         s.price,
         s.duration_minutes,
         sl.id        AS slot_id,
         sl.date,
         sl.start_time,
         sl.end_time,
         bp.name      AS business_name
       FROM bookings b
       JOIN users            u  ON b.user_id     = u.id
       JOIN services         s  ON b.service_id  = s.id
       JOIN slots            sl ON b.slot_id     = sl.id
       LEFT JOIN business_profile bp ON b.business_id = bp.id
       WHERE b.id = $1`,
      [id]
   );
   return rows[0] || null;
};

// ── Get all bookings for a customer ──
const getBookingsByUser = async (userId) => {
   const { rows } = await db.query(
      `SELECT
         b.id,
         b.status,
         b.payment_status,
         b.notes,
         b.created_at,
         s.service_name,
         s.price,
         sl.date,
         sl.start_time,
         sl.end_time,
         bp.name AS business_name
       FROM bookings b  
       JOIN services         s  ON b.service_id  = s.id
       JOIN slots            sl ON b.slot_id     = sl.id
       LEFT JOIN business_profile bp ON (b.business_id = bp.id OR s.business_id = bp.id)
       WHERE b.user_id = $1
       ORDER BY sl.date DESC, sl.start_time DESC`,
      [userId]
   );
   return rows;
};

// ── Get all bookings for a specific Business Owner ──
const getBookingsByBusiness = async (businessId) => {
   const { rows } = await db.query(
      `SELECT
         b.id,
         b.status,
         b.payment_status,
         b.notes,
         b.created_at,
         u.name       AS user_name,
         u.email      AS user_email,
         u.phone      AS user_phone,
         s.service_name,
         s.price,
         sl.date,
         sl.start_time,
         sl.end_time
       FROM bookings b  
       JOIN users    u  ON b.user_id    = u.id
       JOIN services s  ON b.service_id = s.id
       JOIN slots    sl ON b.slot_id    = sl.id
       WHERE (b.business_id = $1 OR s.business_id = $1)
       ORDER BY sl.date DESC, sl.start_time DESC`,
      [businessId]
   );
   return rows;
};

// ── Get all bookings — Platform Admin ──
const getAllBookings = async () => {
   const { rows } = await db.query(
      `SELECT
         b.id,
         b.status,
         b.payment_status,
         b.created_at,
         u.name       AS user_name,
         u.email      AS user_email,
         s.service_name,
         s.price,
         sl.date,
         sl.start_time,
         sl.end_time,
         bp.name      AS business_name
       FROM bookings b
       JOIN users            u  ON b.user_id     = u.id
       JOIN services         s  ON b.service_id  = s.id
       JOIN slots            sl ON b.slot_id     = sl.id
       LEFT JOIN business_profile bp ON b.business_id = bp.id
       ORDER BY b.created_at DESC`
   );
   return rows;
};

// ── Update booking status ──
const updateBookingStatus = async (id, status) => {
   await db.query(
      'UPDATE bookings SET status = $1::booking_status WHERE id = $2',
      [status, id]
   );
};

// ── Update payment status ──
const updatePaymentStatus = async (id, paymentStatus) => {
   await db.query(
      'UPDATE bookings SET payment_status = $1::payment_status WHERE id = $2',
      [paymentStatus, id]
   );
};

// ── Mark reminder sent ──
const markReminderSent = async (id, type = 'same_day') => {
   const column = type === 'day_before' ? 'reminder_day_before_sent' : 'reminder_same_day_sent';
   await db.query(
      `UPDATE bookings SET ${column} = TRUE WHERE id = $1`,
      [id]
   );
};

// ── Get upcoming bookings that need reminders ──
const getBookingsForReminder = async () => {
   const { rows } = await db.query(
      `SELECT
         b.id,
         b.reminder_same_day_sent,
         u.name       AS user_name,
         u.email      AS user_email,
         s.service_name,
         sl.date,
         sl.start_time
       FROM bookings b
       JOIN users    u  ON b.user_id    = u.id
       JOIN services s  ON b.service_id = s.id
       JOIN slots    sl ON b.slot_id    = sl.id
       WHERE b.status                 = 'confirmed'::booking_status
         AND b.reminder_same_day_sent = FALSE
         AND (sl.date + sl.start_time) BETWEEN NOW() AND NOW() + INTERVAL '1 hour'`
   );
   return rows;
};

export {
   createBooking,
   getBookingById,
   getBookingsByUser,
   getBookingsByBusiness,
   getAllBookings,
   updateBookingStatus,
   updatePaymentStatus,
   markReminderSent,
   getBookingsForReminder
};