import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedUserRoute = ({ element }) => {
  const token = localStorage.getItem("user-token");
  const navigate = useNavigate();
  let isAuthenticated = false;

  useEffect(() => {
    const handlePopState = (event) => {
      if (isAuthenticated && window.location.pathname === "/dashboard") {
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated]);

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
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
  } else {
    return <Navigate to="/" replace />;
  }

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedUserRoute;
