import db from '../config/db.js';
import * as userModel from '../models/userModel.js';
import * as paymentModel from '../models/paymentModel.js';
import * as businessModel from '../models/businessModel.js';
import * as systemSettingsModel from '../models/systemSettingsModel.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ============================================================
//  GET /api/admin/analytics
//  High level numbers for the platform admin dashboard
// ============================================================
const getAnalytics = async (req, res, next) => {
   try {
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
            
            (SELECT COUNT(*)::INT FROM users 
             WHERE role = 'business_owner'::user_role) AS total_business_owners,

            (SELECT COUNT(*)::INT FROM business_profile 
             WHERE is_approved = TRUE) AS total_businesses,

            (SELECT COUNT(*)::INT FROM services 
             WHERE is_active = TRUE) AS total_services`
      );

      const paymentMode = await systemSettingsModel.getSetting('payment_mode') || 'free';

      return sendSuccess(res, 'Analytics fetched.', {
         ...rows[0],
         payment_mode: paymentMode
      });

   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/users
//  List all platform users with role management
// ============================================================
const getAllUsers = async (req, res, next) => {
   try {
      const { search = '', status = 'all', role = 'all', sort = 'id-greatest', page = 1, limit = 10 } = req.query;
      const result = await userModel.getUsers({ search, status, role, sort, page, limit });
      return sendSuccess(res, 'All platform users fetched.', result);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  PUT /api/admin/users/:id/role
//  Update a user's role (admin, business_owner, customer)
// ============================================================
const updateUserRole = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['admin', 'business_owner', 'customer'].includes(role)) {
         return sendError(res, 'Invalid role. Must be admin, business_owner, or customer.', 400);
      }

      await userModel.updateRole(id, role);
      const updatedUser = await userModel.findById(id);

      return sendSuccess(res, `User role updated to ${role}.`, updatedUser);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/transactions
//  List all platform transactions across all businesses
// ============================================================
const getAllTransactions = async (req, res, next) => {
   try {
      const { search = '', status = 'all', method = 'all', sort = 'created-newest', page = 1, limit = 10 } = req.query;
      const result = await paymentModel.getTransactions({ search, status, method, sort, page, limit });
      return sendSuccess(res, 'Platform transactions ledger fetched.', result);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/peak-hours
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
// ============================================================
const getPopularServices = async (req, res, next) => {
   try {
      const { rows } = await db.query(
         `SELECT
            s.service_name,
            s.price::FLOAT,
            bp.name AS business_name,
            COUNT(b.id)::INT AS total_bookings,
            COALESCE(SUM(p.amount), 0)::FLOAT AS total_revenue
          FROM services s
          LEFT JOIN business_profile bp ON s.business_id = bp.id
          LEFT JOIN bookings b ON s.id = b.service_id
            AND b.status IN ('confirmed'::booking_status, 'completed'::booking_status)
          LEFT JOIN payments p ON b.id = p.booking_id
            AND p.payment_status = 'paid'::payment_status
          WHERE s.is_active = TRUE
          GROUP BY s.id, s.service_name, s.price, bp.name
          ORDER BY total_bookings DESC`
      );

      return sendSuccess(res, 'Popular services fetched.', rows);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/admin/recent-bookings
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
            sl.start_time,
            bp.name AS business_name
          FROM bookings b
          JOIN users u ON b.user_id = u.id
          JOIN services s ON b.service_id = s.id
          JOIN slots sl ON b.slot_id = sl.id
          LEFT JOIN business_profile bp ON b.business_id = bp.id
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
   getAllUsers,
   updateUserRole,
   getAllTransactions,
   getPeakHours,
   getPopularServices,
   getRecentBookings,
   getRevenueByDay
};