import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedAdminRoute = ({ element }) => {
  const token = localStorage.getItem("admin-token");
  const navigate = useNavigate();
  let isAuthenticated = false;

  useEffect(() => {
    // Disable backward navigation for admin dashboard
    const handlePopState = (event) => {
      if (isAuthenticated && window.location.pathname === "/admin-dashboard") {
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
        localStorage.removeItem("admin-token");
        navigate("/admin-login", { replace: true });
      }
    } catch (error) {
      localStorage.removeItem("admin-token");
      navigate("/admin-login", { replace: true });
    }
  } else {
    return <Navigate to="/admin-login" replace />;
  }

  return isAuthenticated ? element : <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;
