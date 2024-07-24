import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem("admin-token"); 
  return isAuthenticated ? Component : <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;
