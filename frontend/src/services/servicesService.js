import api from "./api";

const getAllServices = async (businessId = null) => {
   const url = businessId ? `/services?business_id=${businessId}` : '/services';
   const response = await api.get(url);
   return response.data;
};

const getServiceDetails = async (id) => {
   const response = await api.get(`/services/${id}`);
   return response.data;
};

const createService = async (serviceData) => {
   const response = await api.post('/services', serviceData);
   return response.data;
};

const getSlots = async (date, businessId = null) => {
   const url = businessId ? `/slots?date=${date}&business_id=${businessId}` : `/slots?date=${date}`;
   const response = await api.get(url);
   return response.data;
};

const generateSlots = async (slotData) => {
   const response = await api.post('/slots/generate', slotData);
   return response.data;
};

export {
   getAllServices,
   getServiceDetails,
   createService,
   getSlots,
   generateSlots
};