import api from "./api";

export const getFeaturedServices = async () => {
   const response = await api.get("/services");

   return response.data;
};