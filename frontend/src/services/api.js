import axios from 'axios';
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenService.js';

const api = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_API_URL,
   withCredentials: true,
   headers: {
      'Content-Type': 'application/json'
   }
});

api.interceptors.request.use((config) => {
   const token = getAccessToken();

   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }

   return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      const errorMessage = error.response?.data?.message?.toLowerCase() || '';

      if (
         error.response?.status === 401 &&
         !originalRequest._retry &&
         (errorMessage.includes('expired') || errorMessage.includes('token expired'))
      ) {
         originalRequest._retry = true;

         try {
            const res = await axios.post(
               'http://localhost:5000/api/auth/refresh-token',
               {},
               { withCredentials: true }
            );

            const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;

            if (!newAccessToken) {
               throw new Error('No access token returned from refresh endpoint');
            }

            setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
         } catch (refreshErr) {
            clearAccessToken();
            return Promise.reject(refreshErr);
         }
      }

      return Promise.reject(error);
   }
);

export default api;