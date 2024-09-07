import React from "react";
import { Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedUserRoute = ({ element: Component }) => {
  const token = localStorage.getItem("user-token");
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem("user-token");
      }
    } catch (error) {
      localStorage.removeItem("user-token");
    }
  }

  return isAuthenticated ? Component : <Navigate to="/" replace />;
};

export default ProtectedUserRoute;