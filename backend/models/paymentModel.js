import db from '../config/db.js';

// ── Create a payment record ──
const createPayment = async ({ booking_id, business_id, razorpay_order_id, amount, payment_status = 'pending', payment_method = null }) => {
   const { rows } = await db.query(
      `INSERT INTO payments (booking_id, business_id, razorpay_order_id, amount, payment_status, payment_method)
       VALUES ($1, $2, $3, $4, $5::payment_status, $6)
       RETURNING id`,
      [booking_id, business_id || null, razorpay_order_id || null, amount, payment_status, payment_method]
   );
   return rows[0].id;
};

// ── Update payment after verification ──
const updatePayment = async ({ booking_id, razorpay_payment_id, razorpay_signature, payment_method, payment_status = 'paid' }) => {
   await db.query(
      `UPDATE payments
       SET razorpay_payment_id = $1,
           razorpay_signature  = $2,
           payment_status      = $3::payment_status,
           payment_method      = $4
       WHERE booking_id = $5`,
      [razorpay_payment_id, razorpay_signature, payment_status, payment_method || 'razorpay', booking_id]
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

// ── Get all transactions — Platform Admin ──
const getAllTransactions = async () => {
   const { rows } = await db.query(
      `SELECT 
         p.id,
         p.booking_id,
         p.amount,
         p.payment_status,
         p.payment_method,
         p.razorpay_order_id,
         p.razorpay_payment_id,
         p.created_at,
         u.name  AS customer_name,
         u.email AS customer_email,
         bp.name AS business_name,
         s.service_name
       FROM payments p
       JOIN bookings b         ON p.booking_id = b.id
       JOIN users u            ON b.user_id    = u.id
       JOIN services s         ON b.service_id = s.id
       LEFT JOIN business_profile bp ON b.business_id = bp.id
       ORDER BY p.created_at DESC`
   );
   return rows;
};

const getTransactions = async ({ search = '', status = 'all', method = 'all', sort = 'created-newest', page = 1, limit = 10 } = {}) => {
   const conditions = [];
   const values = [];
   let paramIdx = 1;

   const allowedSorts = {
      'id-greatest': 'p.id DESC',
      'id-least': 'p.id ASC',
      'created-newest': 'p.created_at DESC',
      'created-oldest': 'p.created_at ASC',
      'amount-highest': 'p.amount DESC',
      'amount-lowest': 'p.amount ASC'
   };

   if (status !== 'all') {
      conditions.push(`p.payment_status = $${paramIdx}::payment_status`);
      values.push(status);
      paramIdx++;
   }

   if (method !== 'all') {
      conditions.push(`p.payment_method = $${paramIdx}`);
      values.push(method);
      paramIdx++;
   }

   const trimmedSearch = (search || '').trim();
   if (trimmedSearch !== '') {
      conditions.push(`(u.name ILIKE $${paramIdx} OR u.email ILIKE $${paramIdx} OR bp.name ILIKE $${paramIdx} OR s.service_name ILIKE $${paramIdx})`);
      values.push(`%${trimmedSearch}%`);
      paramIdx++;
   }

   const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
   const orderByClause = allowedSorts[sort] ? `ORDER BY ${allowedSorts[sort]}` : 'ORDER BY p.created_at DESC';

   const pageNum = Math.max(parseInt(page) || 1, 1);
   const lim = Math.max(parseInt(limit) || 10, 1);
   const offset = (pageNum - 1) * lim;

   const dataQuery = `
      SELECT 
         p.id,
         p.booking_id,
         p.amount,
         p.payment_status,
         p.payment_method,
         p.razorpay_order_id,
         p.razorpay_payment_id,
         p.created_at,
         u.name  AS customer_name,
         u.email AS customer_email,
         bp.name AS business_name,
         s.service_name
      FROM payments p
      JOIN bookings b         ON p.booking_id = b.id
      JOIN users u            ON b.user_id    = u.id
      JOIN services s         ON b.service_id = s.id
      LEFT JOIN business_profile bp ON b.business_id = bp.id
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
   `;

   const countQuery = `
      SELECT COUNT(*)::INT AS total_transactions
      FROM payments p
      JOIN bookings b         ON p.booking_id = b.id
      JOIN users u            ON b.user_id    = u.id
      JOIN services s         ON b.service_id = s.id
      LEFT JOIN business_profile bp ON b.business_id = bp.id
      ${whereClause}
   `;

   const { rows } = await db.query(dataQuery, [...values, lim, offset]);
   const { rows: countRows } = await db.query(countQuery, values);

   const totalTransactions = countRows[0]?.total_transactions || 0;
   const totalPages = Math.max(Math.ceil(totalTransactions / lim), 1);

   return {
      transactions: rows,
      pagination: {
         totalTransactions,
         currentPage: pageNum,
         transactionsPerPage: lim,
         totalPages
      }
   };
};

// ── Get transactions for specific Business Owner ──
const getTransactionsByBusiness = async (businessId) => {
   const { rows } = await db.query(
      `SELECT 
         p.id,
         p.booking_id,
         p.amount,
         p.payment_status,
         p.payment_method,
         p.razorpay_order_id,
         p.razorpay_payment_id,
         p.created_at,
         u.name  AS customer_name,
         u.email AS customer_email,
         s.service_name
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN users u    ON b.user_id    = u.id
       JOIN services s ON b.service_id = s.id
       WHERE b.business_id = $1
       ORDER BY p.created_at DESC`,
      [businessId]
   );
   return rows;
};

export {
   createPayment,
   updatePayment,
   getPaymentByBookingId,
   markPaymentFailed,
   markPaymentRefunded,
   getAllTransactions,
   getTransactions,
   getTransactionsByBusiness
};