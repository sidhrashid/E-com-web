import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
