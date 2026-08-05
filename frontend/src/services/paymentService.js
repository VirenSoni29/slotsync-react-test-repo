import api from "./api";

const createPaymentOrder = async (data) => {
   const response = await api.post('/payment/create-order', data);
   return response.data;
};

const verifyPayment = async (data) => {
   const response = await api.post('/payment/verify', data);
   return response.data;
};

const getPaymentHistory = async () => {
   const response = await api.get('/payment/history');
   return response.data;
};

export {
   createPaymentOrder,
   verifyPayment,
   getPaymentHistory
};