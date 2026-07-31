import api from "./api";

const createPaymentOrder = async (data) => {
   const response = await api.post('/payment/create-order', data)

   return response.data
}

const verifyPayment = async (data) => {
   await api.post('/payment/verify', data)
}

export {
   createPaymentOrder,
   verifyPayment
}