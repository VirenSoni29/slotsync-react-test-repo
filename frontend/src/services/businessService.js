import api from './api';

const registerBusiness = async (businessData) => {
   const response = await api.post('/business/register', businessData);
   return response.data;
};

const getMyBusiness = async () => {
   const response = await api.get('/business/my-profile');
   return response.data;
};

const updateMyBusiness = async (businessData) => {
   const response = await api.put('/business/my-profile', businessData);
   return response.data;
};

const getBusinessDashboard = async () => {
   const response = await api.get('/business/dashboard');
   return response.data;
};

const getPublicBusinesses = async () => {
   const response = await api.get('/business/public');
   return response.data;
};

const getPublicBusinessByIdOrSlug = async (identifier) => {
   const response = await api.get(`/business/public/${identifier}`);
   return response.data;
};

export {
   registerBusiness,
   getMyBusiness,
   updateMyBusiness,
   getBusinessDashboard,
   getPublicBusinesses,
   getPublicBusinessByIdOrSlug
};
