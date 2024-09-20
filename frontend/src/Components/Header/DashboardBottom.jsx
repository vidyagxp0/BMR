import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardBottom.css";

function DashboardBottom() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = (path) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 500);
  };

  return (
    <div className="Header_Bottom bg-white">
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className="headerBottomInner">
        <div className="headerBottomLft">
          <div className="navItem" onClick={() => handleClick("/dashboard")}>
            <i className="ri-home-3-fill"></i>
            <h3>Dashboard</h3>
          </div>

          <div className="navItem" onClick={() => handleClick("/bmr-forms")}>
            <i className="ri-dashboard-3-fill"></i>
            <h3>BMR Forms</h3>
          </div>

          <div
            className="navItem"
            onClick={() => handleClick("/process/bmr_process")}
          >
            <i className="ri-bar-chart-fill"></i>
            <h3>BMR Form Builder</h3>
          </div>

          <div className="navItem" onClick={() => handleClick("/analytics")}>
            <i className="ri-dashboard-3-fill"></i>
            <h3>Analytics</h3>
          </div>

          <div className="navItem" onClick={() => handleClick("/logs")}>
            <i className="fa fa-book" aria-hidden="true"></i>
            <h3>Logs</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardBottom;
