import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Component to protect routes that require authentication
 * @param {object} children - Child components to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isLogged } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isLogged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
