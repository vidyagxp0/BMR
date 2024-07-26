import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLogin from "./Pages/AdminSide/AdminLogin/AdminLogin";
import AdminDashBoard from "./Pages/AdminSide/AdminDashBoard/AdminDashBoard";
import { ToastContainer } from "react-toastify";
import Wrapper from "./Pages/Wrapper";
import AddUser from "./Pages/AdminSide/AddUser/AddUser";
import UpdateUser from "./Pages/AdminSide/Modals/UpdateUserModal";
import Login from "./Pages/UserSide/Login/Login";
import Dashboard from "./Pages/UserSide/Dashboard/Dashboard";
import ProtectedAdminRoute from "./Pages/ProtectedRoute/ProtectedAdminRoute";
import WrapperUser from "./Pages/WrapperUser";
import BMRProcess from "./Pages/UserSide/pages/Process/BMRProcess";
import BMRDetails from "./Pages/UserSide/pages/BMRDetails/BMRDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="" element={<WrapperUser />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/process/bmr_process" element={<BMRProcess />} />
          <Route path="/process/bmr_details" element={<BMRDetails />} />
          </Route>
         
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="" element={<Wrapper />}>
            <Route
              path="/admin-dashboard"
              element={<ProtectedAdminRoute element={<AdminDashBoard />} />}
            />
            <Route
              path="/admin-add-user"
              element={<ProtectedAdminRoute element={<AddUser />} />}
            />
            <Route
              path="/admin-update-user"
              element={<ProtectedAdminRoute element={<UpdateUser />} />}
            />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
