import { sendError } from "../utils/apiResponse.js";
import * as businessModel from "../models/businessModel.js";

const isAdmin = (req, res, next) => {
   if (req.user?.role !== 'admin') {
      return sendError(res, 'Access denied. Platform Admins only.', 403);
   }
   next();
};

const isBusinessOwner = async (req, res, next) => {
   try {
      if (req.user?.role !== 'business_owner' && req.user?.role !== 'admin') {
         return sendError(res, 'Access denied. Business owners only.', 403);
      }

      // If user is admin, allow them to act as business owner if needed
      const business = await businessModel.getBusinessByOwnerId(req.user.id);
      if (!business && req.user?.role !== 'admin') {
         return sendError(res, 'No business profile found for this account.', 404);
      }

      req.business = business || null;
      next();
   } catch (error) {
      next(error);
   }
};

const isCustomer = (req, res, next) => {
   if (!req.user) {
      return sendError(res, 'Access denied. Please log in.', 401);
   }
   next();
};

const isAuthenticated = (req, res, next) => {
   if (!req.user) {
      return sendError(res, 'Access denied. Please log in.', 401);
   }
   next();
};

export {
   isAdmin,
   isBusinessOwner,
   isCustomer,
   isAuthenticated
};
