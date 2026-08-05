import * as businessModel from '../models/businessModel.js';
import * as userModel from '../models/userModel.js';
import * as bookingModel from '../models/bookingModel.js';
import * as paymentModel from '../models/paymentModel.js';
import * as serviceModel from '../models/serviceModel.js';
import db from '../config/db.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ============================================================
//  POST /api/business/register
//  Customer registers a business entry -> Upgrades role to business_owner
// ============================================================
const registerBusiness = async (req, res, next) => {
   try {
      const { name, tagline, email, phone, address, category, website, slug } = req.body;

      if (!name) {
         return sendError(res, 'Business name is required.', 400);
      }

      // Check if user already owns a business
      const existing = await businessModel.getBusinessByOwnerId(req.user.id);
      if (existing) {
         return sendError(res, 'You already have a business profile created.', 400);
      }

      // Create business profile
      const business = await businessModel.createBusiness({
         owner_id: req.user.id,
         name,
         tagline,
         email: email || req.user.email,
         phone: phone || req.user.phone,
         address,
         category,
         website,
         slug
      });

      // Upgrade user role to business_owner
      await userModel.updateRole(req.user.id, 'business_owner');
      const updatedUser = await userModel.getUserWithBusiness(req.user.id);

      return sendSuccess(res, 'Business registered successfully! Your account is now a Business Owner.', {
         business,
         user: updatedUser
      }, 201);

   } catch (error) {
      if (error.code === '23505') { // Unique constraint violation in Postgres
         return sendError(res, 'A business with this name or slug already exists.', 400);
      }
      next(error);
   }
};

// ============================================================
//  GET /api/business/my-profile
//  Business Owner gets their own business details
// ============================================================
const getMyBusiness = async (req, res, next) => {
   try {
      const business = await businessModel.getBusinessByOwnerId(req.user.id);
      if (!business) {
         return sendError(res, 'Business profile not found.', 404);
      }
      return sendSuccess(res, 'Business profile fetched.', business);
   } catch (error) {
      next(error);
   }
};

// ============================================================
//  PUT /api/business/my-profile
//  Business Owner updates their business details
// ============================================================
const updateMyBusiness = async (req, res, next) => {
   try {
      const business = await businessModel.getBusinessByOwnerId(req.user.id);
      if (!business) {
         return sendError(res, 'Business profile not found.', 404);
      }

      const updated = await businessModel.updateBusiness(business.id, req.body);
      return sendSuccess(res, 'Business profile updated successfully.', updated);
   } catch (error) {
      next(error);
   }
};

// ============================================================
//  GET /api/business/dashboard
//  Business Owner Dashboard Analytics
// ============================================================
const getBusinessDashboard = async (req, res, next) => {
   try {
      const business = await businessModel.getBusinessByOwnerId(req.user.id);
      if (!business) {
         return sendError(res, 'No business profile found.', 404);
      }

      const businessId = business.id;

      // Executed as combined queries for speed
      const statsQuery = await db.query(
         `SELECT 
            (SELECT COUNT(*)::INT FROM bookings b JOIN services s ON b.service_id = s.id 
             WHERE b.business_id = $1 OR s.business_id = $1) AS total_bookings,
            
            (SELECT COUNT(*)::INT FROM bookings b JOIN services s ON b.service_id = s.id 
             WHERE (b.business_id = $1 OR s.business_id = $1) AND b.status = 'confirmed'::booking_status) AS confirmed_bookings,
            
            (SELECT COALESCE(SUM(p.amount), 0)::FLOAT FROM payments p 
             JOIN bookings b ON p.booking_id = b.id JOIN services s ON b.service_id = s.id
             WHERE (p.business_id = $1 OR b.business_id = $1 OR s.business_id = $1) AND p.payment_status = 'paid'::payment_status) AS total_revenue,
            
            (SELECT COALESCE(SUM(p.amount), 0)::FLOAT FROM payments p 
             JOIN bookings b ON p.booking_id = b.id JOIN services s ON b.service_id = s.id
             WHERE (p.business_id = $1 OR b.business_id = $1 OR s.business_id = $1) AND p.payment_status = 'paid'::payment_status 
               AND date_trunc('month', p.created_at) = date_trunc('month', CURRENT_DATE)) AS monthly_revenue,
            
            (SELECT COUNT(*)::INT FROM services 
             WHERE business_id = $1 AND is_active = TRUE) AS total_services`,
         [businessId]
      );

      const recentBookings = await bookingModel.getBookingsByBusiness(businessId);
      const services = await serviceModel.getServicesByBusiness(businessId);
      const transactions = await paymentModel.getTransactionsByBusiness(businessId);

      return sendSuccess(res, 'Business dashboard analytics fetched.', {
         business,
         stats: statsQuery.rows[0],
         recentBookings: recentBookings.slice(0, 10),
         services,
         recentTransactions: transactions.slice(0, 10)
      });

   } catch (error) {
      next(error);
   }
};

// ============================================================
//  GET /api/business/public
//  Public API: List all approved businesses for customer browsing
// ============================================================
const getPublicBusinesses = async (req, res, next) => {
   try {
      const businesses = await businessModel.getAllBusinesses();
      return sendSuccess(res, 'Public business directory fetched.', businesses);
   } catch (error) {
      next(error);
   }
};

// ============================================================
//  GET /api/business/public/:identifier
//  Public API: Fetch single business by slug or ID
// ============================================================
const getPublicBusinessByIdOrSlug = async (req, res, next) => {
   try {
      const { identifier } = req.params;
      let business = null;

      if (!isNaN(identifier)) {
         business = await businessModel.getBusinessById(parseInt(identifier));
      } else {
         business = await businessModel.getBusinessBySlug(identifier);
      }

      if (!business) {
         return sendError(res, 'Business not found.', 404);
      }

      const services = await serviceModel.getServicesByBusiness(business.id);

      return sendSuccess(res, 'Business details fetched.', {
         business,
         services
      });

   } catch (error) {
      next(error);
   }
};

export {
   registerBusiness,
   getMyBusiness,
   updateMyBusiness,
   getBusinessDashboard,
   getPublicBusinesses,
   getPublicBusinessByIdOrSlug
};