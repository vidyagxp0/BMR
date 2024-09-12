import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedUserRoute = ({ element }) => {
  const navigate = useNavigate();
  let isAuthenticated = false;

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user-token") {
        isAuthenticated = false; // Assume logout if token changes
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (localStorage.getItem("user-token")) {
    try {
      const decodedToken = jwtDecode(localStorage.getItem("user-token"));
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem("user-token");
        navigate("/", { replace: true });
      }
    } catch (error) {
      localStorage.removeItem("user-token");
      navigate("/", { replace: true });
    }
  }

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedUserRoute;
