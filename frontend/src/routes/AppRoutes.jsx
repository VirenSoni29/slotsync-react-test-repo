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

// New Role Pages
import CreateBusiness from "../pages/business/CreateBusiness";
import BusinessDashboard from "../pages/business/BusinessDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminTransactions from "../pages/admin/AdminTransactions";

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
            <Route path="/create-business" element={<CreateBusiness />} />
         </Route>

         {/* Customer Routes */}
         <Route element={<ProtectedRoute allowedRoles={['customer', 'business_owner', 'admin']} />}>
            <Route path="/services/book" element={<Book />} />
            <Route path="/user/my-bookings" element={<MyBookings />} />
         </Route>

         {/* Business Owner Routes */}
         <Route element={<ProtectedRoute allowedRoles={['business_owner', 'admin']} />}>
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
         </Route>

         {/* Platform Admin Routes */}
         <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
         </Route>

         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default AppRoutes;
