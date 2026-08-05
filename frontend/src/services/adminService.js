import api from './api';

const getAdminAnalytics = async () => {
   const response = await api.get('/admin/analytics');
   return response.data;
};

const getAllUsers = async (params) => {
   const response = await api.get('/admin/users', { params });
   return response.data;
};

const updateUserRole = async (userId, role) => {
   const response = await api.put(`/admin/users/${userId}/role`, { role });
   return response.data;
};

const getAllTransactions = async (params) => {
   const response = await api.get('/admin/transactions', { params });
   return response.data;
};

export {
   getAdminAnalytics,
   getAllUsers,
   updateUserRole,
   getAllTransactions
};
