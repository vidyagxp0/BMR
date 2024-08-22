import React from "react";
import { Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedUserRoute = ({ element: Component }) => {
  const token = localStorage.getItem("user-token"); //? take 'user-token' from local storage and stored in 'token' variable.
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); //? decode the token
      const currentTime = Date.now() / 1000; //? Current time ko seconds mein lete hain
      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem("user-token"); //?  Token expire hone par remove kar dete hain
      }
    } catch (error) {
      localStorage.removeItem("user-token"); //? Agar token invalid ho to remove kar dete hain
    
    }
  }

  return isAuthenticated ? Component : <Navigate to="/" replace />;
};

export default ProtectedUserRoute;
