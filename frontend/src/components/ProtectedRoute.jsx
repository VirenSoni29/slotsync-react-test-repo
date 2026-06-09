import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
   const { isAuthenticated, user, loading } = useAuth();

   const location = useLocation();

   if (loading) return <div className="classic-loader"></div>;

   if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace state={{ from: location }} />;
   }

   if (allowedRoles) {
      const hasAccess = allowedRoles.includes(user.role)

      if (!hasAccess) {
         return <Navigate to='/unauthorized' replace />
      }
   }

   return <Outlet />
};

export default ProtectedRoute;
