import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./DashboardBottom.css";

function DashboardBottom() {


  const location = useLocation();
//   const isDocumentPage = location.pathname === "/documents";
//   const isMyDMS = location.pathname === "/My-DMS";
//   const isMyTasks = location.pathname === "/my-tasks";
//   const isTms = location.pathname === "/tms-dashboard";
//   const isDashboard = location.pathname === "/dashboard";
  return (
    <>
      <div className="Header_Bottom bg-white ">
        <div className="headerBottomInner ">
          <div className="headerBottomLft">
            <NavLink exact to={"/dashboard"} activeClassName="active">
              <div className="navItem">
                <i className="ri-home-3-fill"></i>
                <h3>Dashboard</h3>
              </div>
            </NavLink>

            <NavLink exact >
              <div className="navItem" activeClassName="active">
                <i className="ri-dashboard-3-fill"></i>
                <h3>BMR Forms</h3>
              </div>
            </NavLink>
            <NavLink exact to="/process/bmr_process">
              <div className="navItem" activeClassName="active">
                <i className="ri-bar-chart-fill"></i>
                <h3>BMR Form Builder</h3>
              </div>
            </NavLink>
            {/* <NavLink exact to="/desk">
              <div className="navItem" activeClassName="active">
                <i className="ri-file-marked-fill"></i>
                <h3>Standards</h3>
              </div>
            </NavLink> */}
            <NavLink exact >
              <div className="navItem" activeClassName="active">
                <i className="ri-dashboard-3-fill"></i>
                <h3>Analytics</h3>
              </div>
            </NavLink>
            <NavLink exact  activeClassName="active">
              <div className="navItem">
                <i class="fa fa-book" aria-hidden="true"></i>
                <h3>Logs</h3>
              </div>
            </NavLink>
        
          </div>
          {/* <div className="headerBottomRgt">
            {isDocumentPage ? (
              <div className="themeBtn" onClick={() => setDocumentModal(true)}>
                Create Document
              </div>
            ) : isMyDMS ? (
              <div className="themeBtn" onClick={() => setDocumentModal(true)}>
                New Document
              </div>
            ) : isMyTasks ? (
              ""
            ) : isTms ? (
              ""
            ) : isDashboard ? (
              ""
            ) : (
              <div className="themeBtn" onClick={() => setRecordModal(true)}>
                Initiate Record
              </div>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
}

export default DashboardBottom;
