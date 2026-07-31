import api from "./api";

const getAllServices = async () => {
   const response = await api.get('/services')

   return response.data
}

const getServiceDetails = async (id) => {
   const response = await api.get(`/services/${id}`)

   return response.data
}

const getSlots = async (date) => {
   const response = await api.get(`/slots?date=${date}`)

   return response.data
}

export {
   getAllServices,
   getServiceDetails,
   getSlots
}