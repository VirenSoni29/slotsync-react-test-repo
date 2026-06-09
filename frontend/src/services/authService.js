import api from "./api";

const loginUser = async (data) => {
   const response = await api.post(
      '/auth/login',
      data
   )

   return response.data
}

const registerUser = async (data) => {
   const response = await api.post(
      '/auth/register',
      data
   )

   return response.data
}

const logoutUser = async () => {
   const response = await api.post('/auth/logout')
   return response.data
}

const refreshAccessToken = async () => {
   const response = await api.post('/auth/refresh-token')
   return response.data
}

const verifyOtp = async (data) => {
   const response = await api.post(
      '/auth/verify-otp',
      data
   )

   return response.data
}

const sendOtp = async (data) => {
   const response = await api.post(
      '/auth/send-otp',
      data
   )
   return response.data
}

const forgotPassword = async (data) => {
   const response = await api.post(
      '/auth/forgot-password',
      data
   )
   
   return response.data
}

const resetPassword = async (data) => {
   const response = await api.post(
      '/auth/reset-password',
      data
   )

   return response.data
}

export {
   loginUser,
   registerUser,
   logoutUser,
   refreshAccessToken,
   verifyOtp,
   sendOtp,
   forgotPassword,
   resetPassword
}