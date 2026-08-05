import * as serviceModel from '../models/serviceModel.js';
import * as businessModel from '../models/businessModel.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ============================================================
//  GET /api/services
//  Public — anyone can view services (optional ?business_id= query)
// ============================================================
const getAllServices = async (req, res, next) => {
   try {
      const { business_id } = req.query;
      const services = await serviceModel.getAllServices(business_id ? parseInt(business_id) : null);
      return sendSuccess(res, 'Services retrieved successfully', services);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  GET /api/services/:id
// ============================================================
const getServiceById = async (req, res, next) => {
   try {
      const service = await serviceModel.getServiceById(req.params.id);

      if (!service) {
         return sendError(res, 'Service not found', 404);
      }

      return sendSuccess(res, 'Service retrieved successfully', service);
   } catch (err) {
      next(err);
   }
};

// ============================================================
//  POST /api/services
//  Business Owner & Admin — create a new service for their business
// ============================================================
const createService = async (req, res, next) => {
   try {
      const { service_name, description, price, duration_minutes, business_id } = req.body;

      let targetBusinessId = business_id;
      if (!targetBusinessId && req.business) {
         targetBusinessId = req.business.id;
      }

      if (!targetBusinessId && req.user?.id) {
         const userBiz = await businessModel.getBusinessByOwnerId(req.user.id);
         if (userBiz) targetBusinessId = userBiz.id;
      }

      const newServiceData = await serviceModel.createService({
         business_id: targetBusinessId || null,
         service_name,
         description,
         price,
         duration_minutes
      });

      return sendSuccess(res, 'Service created successfully', newServiceData, 201);
   } catch (error) {
      next(error);
   }
};

// ============================================================
//  PUT /api/services/:id
// ============================================================
const updateService = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { service_name, description, price, duration_minutes } = req.body;

      const existing = await serviceModel.getServiceById(id);
      if (!existing) {
         return sendError(res, 'Service not found', 404);
      }

      let targetBusinessId = req.business?.id;
      if (!targetBusinessId && req.user?.id) {
         const userBiz = await businessModel.getBusinessByOwnerId(req.user.id);
         if (userBiz) targetBusinessId = userBiz.id;
      }

      await serviceModel.updateService(id, {
         service_name,
         description,
         price,
         duration_minutes,
         business_id: targetBusinessId
      });

      const updated = await serviceModel.getServiceById(id);
      return sendSuccess(res, 'Service updated successfully', updated);
   } catch (error) {
      next(error);
   }
};

// ============================================================
//  DELETE /api/services/:id
// ============================================================
const deleteService = async (req, res, next) => {
   try {
      const { id } = req.params;

      const existing = await serviceModel.getServiceById(id);
      if (!existing) {
         return sendError(res, 'Service not found', 404);
      }

      let targetBusinessId = req.business?.id;
      if (!targetBusinessId && req.user?.id) {
         const userBiz = await businessModel.getBusinessByOwnerId(req.user.id);
         if (userBiz) targetBusinessId = userBiz.id;
      }

      await serviceModel.deleteService(id, targetBusinessId);
      return sendSuccess(res, 'Service deleted successfully');
   } catch (error) {
      next(error);
   }
};

export {
   getAllServices,
   getServiceById,
   createService,
   updateService,
   deleteService
};
