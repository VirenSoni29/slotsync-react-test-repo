import api from "./api";

const getAllBookings = async () => {
   const response = await api.get('/bookings/my')

   return response.data
}

const createBooking = async (data) => {
   const response = await api.post('/bookings', data)

   return response.data
}

const cancelBooking = async (id) => {
   await api.put(`/bookings/${id}/cancel`, {})
}

export {
   getAllBookings,
   createBooking,
   cancelBooking
}