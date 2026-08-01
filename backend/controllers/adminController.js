import db from '../config/db.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ============================================================
//  GET /api/admin/analytics
//  High level numbers for the dashboard
// ============================================================
const getAnalytics = async (req, res, next) => {
   try {
      // Executed as a single combined query for speed & efficiency
      const { rows } = await db.query(
         `SELECT 
            (SELECT COUNT(*)::INT FROM bookings) AS total_bookings,
            
            (SELECT COUNT(*)::INT FROM bookings 
             WHERE status = 'confirmed'::booking_status) AS confirmed_bookings,
            
            (SELECT COALESCE(SUM(amount), 0)::FLOAT FROM payments 
             WHERE payment_status = 'paid'::payment_status) AS total_revenue,
            
            (SELECT COALESCE(SUM(amount), 0)::FLOAT FROM payments 
             WHERE payment_status = 'paid'::payment_status 
               AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)) AS monthly_revenue,
            
            (SELECT COUNT(*)::INT FROM users 
             WHERE role = 'customer'::user_role) AS total_customers,
            
            (SELECT COUNT(*)::INT FROM services 
             WHERE is_active = TRUE) AS total_services`
      );

      return sendSuccess(res, 'Analytics fetched.', rows[0]);

   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/peak-hours
//  Which time slots get booked the most
// ============================================================
const getPeakHours = async (req, res, next) => {
   try {
      const { rows } = await db.query(
         `SELECT
            TO_CHAR(sl.start_time, 'HH24:MI') AS hour,
            COUNT(*)::INT AS booking_count
          FROM bookings b
          JOIN slots sl ON b.slot_id = sl.id
          WHERE b.status IN ('confirmed'::booking_status, 'completed'::booking_status)
          GROUP BY sl.start_time
          ORDER BY booking_count DESC
          LIMIT 10`
      );

      return sendSuccess(res, 'Peak hours fetched.', rows);

   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/popular-services
//  Which services get booked the most
// ============================================================
const getPopularServices = async (req, res, next) => {
   try {
      const { rows } = await db.query(
         `SELECT
            s.service_name,
            s.price::FLOAT,
            COUNT(b.id)::INT AS total_bookings,
            COALESCE(SUM(p.amount), 0)::FLOAT AS total_revenue
          FROM services s
          LEFT JOIN bookings b ON s.id = b.service_id
            AND b.status IN ('confirmed'::booking_status, 'completed'::booking_status)
          LEFT JOIN payments p ON b.id = p.booking_id
            AND p.payment_status = 'paid'::payment_status
          WHERE s.is_active = TRUE
          GROUP BY s.id, s.service_name, s.price
          ORDER BY total_bookings DESC`
      );

      return sendSuccess(res, 'Popular services fetched.', rows);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/recent-bookings
//  Last 10 bookings for the dashboard feed
// ============================================================
const getRecentBookings = async (req, res, next) => {
   try {
      const { rows } = await db.query(
         `SELECT
            b.id,
            b.status,
            b.payment_status,
            b.created_at,
            u.name AS user_name,
            u.email AS user_email,
            s.service_name,
            s.price::FLOAT,
            sl.date,
            sl.start_time
          FROM bookings b
          JOIN users u ON b.user_id    = u.id
          JOIN services s ON b.service_id = s.id
          JOIN slots sl ON b.slot_id    = sl.id
          ORDER BY b.created_at DESC
          LIMIT 10`
      );

      return sendSuccess(res, 'Recent bookings fetched.', rows);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/revenue-by-day
//  Revenue for each day in the last 30 days
//  Used for a chart on the dashboard
// ============================================================
const getRevenueByDay = async (req, res, next) => {
   try {
      const { rows } = await db.query(
         `SELECT
            created_at::DATE AS date,
            COALESCE(SUM(amount), 0)::FLOAT AS revenue,
            COUNT(*)::INT AS transactions
          FROM payments
          WHERE payment_status = 'paid'::payment_status
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY created_at::DATE
          ORDER BY date ASC`
      );

      return sendSuccess(res, 'Revenue by day fetched.', rows);
   } catch (err) {
      next(err);
   }
};

export {
   getAnalytics,
   getPeakHours,
   getPopularServices,
   getRecentBookings,
   getRevenueByDay
};