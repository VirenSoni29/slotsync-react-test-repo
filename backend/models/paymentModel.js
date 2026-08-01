// ============================================================
//  models/paymentModel.js
//  All SQL queries for the payments table (PostgreSQL)
// ============================================================

import db from '../config/db.js';

// ── Create a payment record ──
// Called when Razorpay order is created
// Status starts as 'pending' until payment is verified
const createPayment = async ({ booking_id, razorpay_order_id, amount }) => {
   const { rows } = await db.query(
      `INSERT INTO payments (booking_id, razorpay_order_id, amount, payment_status)
       VALUES ($1, $2, $3, 'pending'::payment_status)
       RETURNING id`,
      [booking_id, razorpay_order_id, amount]
   );
   return rows[0].id;
};

// ── Update payment after verification ──
// Called after HMAC signature is verified
const updatePayment = async ({ booking_id, razorpay_payment_id, razorpay_signature, payment_method }) => {
   await db.query(
      `UPDATE payments
       SET razorpay_payment_id = $1,
           razorpay_signature  = $2,
           payment_status      = 'paid'::payment_status,
           payment_method      = $3
       WHERE booking_id = $4`,
      [razorpay_payment_id, razorpay_signature, payment_method || 'razorpay', booking_id]
   );
};

const getPaymentByBookingId = async (bookingId) => {
   const { rows } = await db.query(
      `SELECT * FROM payments WHERE booking_id = $1`,
      [bookingId]
   );
   return rows[0] || null;
};

const markPaymentFailed = async (bookingId) => {
   await db.query(
      `UPDATE payments SET payment_status = 'failed'::payment_status WHERE booking_id = $1`,
      [bookingId]
   );
};

const markPaymentRefunded = async (bookingId) => {
   await db.query(
      `UPDATE payments SET payment_status = 'refunded'::payment_status WHERE booking_id = $1`,
      [bookingId]
   );
};

export {
   createPayment,
   updatePayment,
   getPaymentByBookingId,
   markPaymentFailed,
   markPaymentRefunded
};