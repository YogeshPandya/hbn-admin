import { Navigate, Outlet } from "react-router";

// ProtectedRoute component to guard routes
const ProtectedRoute: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  // Check for token in localStorage directly for added security
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};


export default ProtectedRoute;