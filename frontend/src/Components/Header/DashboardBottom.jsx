import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DashboardBottom.css";

function DashboardBottom() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const handleClick = (pathname) => {
    setLoading(true);
    // Simulating a loading delay before navigation
    setTimeout(() => {
      setLoading(false);
      navigate(pathname);
    }, 1000);
  };
  return (
    <div className="Header_Bottom bg-white">
      {loading && (
        <div className="loader-container">
          <div className="loader">
            <span className="loader-text">Loading</span>
            <span className="load" />
          </div>
        </div>
      )}

      
      <div className="headerBottomInner">
        <div className="headerBottomLft">
          <div
            className={`navItem ${pathname === "/dashboard" ? "active" : ""}`}
            onClick={() => handleClick("/dashboard")}
          >
            <i className="ri-home-3-fill"></i>
            <h3>Dashboard</h3>
          </div>

          <div
            className={`navItem ${pathname === "/bmr-forms" ? "active" : ""}`}
            onClick={() => handleClick("/bmr-forms")}
          >
            <i class="fa-brands fa-wpforms"></i>
            <h3>BMR Forms</h3>
          </div>

          <div
            className={`navItem ${
              pathname === "/process/bmr_process" ? "active" : ""
            }`}
            onClick={() => handleClick("/process/bmr_process")}
          >
            <i className="fa-solid fa-file-waveform"></i>
            <h3>BMR Form Builder</h3>
          </div>

          <div
            className={`navItem ${pathname === "/analytics" ? "active" : ""}`}
            onClick={() => handleClick("/analytics")}
          >
            <i className="ri-bar-chart-fill"></i>
            <h3>Analytics</h3>
          </div>

          <div
            className={`navItem ${pathname === "/logs" ? "active" : ""}`}
            onClick={() => handleClick("/logs")}
          >
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
            <h3>Logs</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardBottom;
