import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedAdminRoute = ({ element: Component }) => {
  const token = localStorage.getItem("admin-token");
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem("admin-token");
      }
    } catch (error) {
      localStorage.removeItem("admin-token");
    }
  }

  return isAuthenticated ? Component : <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;