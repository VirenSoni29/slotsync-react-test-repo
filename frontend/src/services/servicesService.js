import api from "./api";

const getAllServices = async () => {
   const response = await api.get('/services')

   return response.data
}

export {
   getAllServices
}