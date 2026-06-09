import axios from 'axios';
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenService.js';

const api = axios.create({
   baseURL: 'http://localhost:5000/api',
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

api.interceptors.response.use((response) => response, async (error) => {
   const originalRequest = error.config;

   if (error.response?.status === 401 && !originalRequest._retry && error.response?.data?.message.includes('token expired')) {
      originalRequest._retry = true;

      try {
         const { data } = await axios.post(
            'http://localhost:5000/api/auth/refresh-token',
            {},
            { withCredentials: true }
         );

         setAccessToken(data.accessToken);
         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

         return api(originalRequest);
      } catch (refreshErr) {
         clearAccessToken();
         return Promise.reject(refreshErr);
      }
   }

   return Promise.reject(error);
});

export default api;