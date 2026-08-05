import { createContext, useEffect, useRef, useState } from "react";
import {
   forgotPassword,
   loginUser,
   logoutUser,
   refreshAccessToken,
   registerUser,
   resetPassword,
   sendOtp,
   verifyOtp,
} from "../services/authService.js";
import { clearAccessToken, setAccessToken, subscribeAccessToken } from "../services/tokenService";
import { toast } from "sonner";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [accessToken, setAccessTokenState] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const unsubscribe = subscribeAccessToken((newToken) => {
         setAccessTokenState(newToken);
         if (!newToken) {
            setUser(null);
         }
      });
      return unsubscribe;
   }, []);

   const login = async (formData) => {
      const responseData = await loginUser(formData);

      setUser(responseData.data.user);
      setAccessTokenState(responseData.data.accessToken);
      setAccessToken(responseData.data.accessToken);

      return responseData;
   };

   const register = async (formData) => {
      return await registerUser(formData);
   };

   const logout = async () => {
      try {
         await logoutUser();
         toast.success('Logged out')
      } catch (err) {
         console.log(err);
         toast.error(err.response?.data?.message || err.message);
      }

      setUser(null);
      setAccessTokenState(null);
      clearAccessToken();
   };

   const restoreSession = async () => {
      try {
         const responseData = await refreshAccessToken();

         setUser(responseData.data.user);
         setAccessToken(responseData.data.accessToken);
         setAccessTokenState(responseData.data.accessToken);
      } catch (err) {
         console.log(err);
         console.log(err.response?.data?.message || err.message);

         setUser(null);
         clearAccessToken();
         setAccessTokenState(null);
      } finally {
         setLoading(false);
      }
   };

   const hasRestoredSession = useRef(false);

   useEffect(() => {
      if (hasRestoredSession.current) return;

      hasRestoredSession.current = true;

      const initializeAuth = async () => {
         await restoreSession();
      };

      initializeAuth();
   }, []);

   const verifyUserWithOtp = async (data) => {
      const responseData = await verifyOtp(data)

      return responseData
   }

   const sendOtpToVerify = async (data) => {
      const responseData = await sendOtp(data)

      return responseData
   }

   const forgotPasswordOtp = async (data) => {
      const responseData = await forgotPassword(data)

      return responseData
   }

   const resetUserPassword = async (data) => {
      const responseData = await resetPassword(data)

      return responseData
   }

   const value = {
      user,
      setUser,
      accessToken,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isBusinessOwner: user?.role === 'business_owner',
      isCustomer: user?.role === 'customer',
      login,
      register,
      logout,
      verifyUserWithOtp,
      sendOtpToVerify,
      forgotPasswordOtp,
      resetUserPassword
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
