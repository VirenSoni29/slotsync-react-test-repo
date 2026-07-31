import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import AuthPage from "../pages/auth/AuthPage";
import NotFound from "../pages/NotFound";
import PublicRoute from "../components/PublicRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../pages/user/Profile";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Services from "../pages/Services";
import Book from "../pages/Book";
import MyBookings from "../pages/MyBookings";

const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<Landing />} />

         <Route path="/auth/verify-otp" element={<VerifyOtp />} />
         <Route element={<PublicRoute />}>
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/:mode" element={<AuthPage />} />
         </Route>

         <Route path="/services" element={<Services />} />

         <Route element={<ProtectedRoute />}>
            <Route path="/user/profile" element={<Profile />} />
         </Route>

         <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/services/book" element={<Book />} />
            <Route path="/user/my-bookings" element={<MyBookings />} />
         </Route>
         
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default AppRoutes;
