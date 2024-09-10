import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import AdminLogin from "./Pages/AdminSide/AdminLogin/AdminLogin";
import AdminDashBoard from "./Pages/AdminSide/AdminDashBoard/AdminDashBoard";
import { ToastContainer } from "react-toastify";
import Wrapper from "./Pages/Wrapper";
import AddUser from "./Pages/AdminSide/AddUser/AddUser";
import UpdateUser from "./Pages/AdminSide/Modals/UpdateUserModal";
import Login from "./Pages/UserSide/Login/Login";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Pages/UserSide/Dashboard/Dashboard";
import ProtectedAdminRoute from "./Pages/ProtectedRoute/ProtectedAdminRoute";
import ProtectedUserRoute from "./Pages/ProtectedRoute/ProtectedUserRoute";
import WrapperUser from "./Pages/WrapperUser";
import BMRProcess from "./Pages/UserSide/pages/Process/BMRProcess";
import BMRDetails from "./Pages/UserSide/pages/BMRDetails/BMRDetails";
import BMRProcessDetails from "./Pages/UserSide/pages/Process/BMRProcessDetails";
import BMRRecords from "./Pages/UserSide/pages/BMRRecords/BMRRecords";
import About from "./Pages/HeaderComponents/About";
import Help from "./Pages/HeaderComponents/Help";
import HelpdeskPersonnel from "./Pages/HeaderComponents/HelpdeskPersonnel";
import BoardOfDirectors from "./Pages/HeaderComponents/BoardOfDirectors";
import AuditTrail from "./Pages/UserSide/auditTrail/auditTrail";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BMRForms from "./Pages/UserSide/pages/Process/Modals/BMRForms";

function App() {
  return (
    <BrowserRouter>
      <RouteGuard />
      <ToastContainer />
    </BrowserRouter>
  );
}

function RouteGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (event) => {
      if (location.pathname === "/dashboard") {
        history.pushState(null, "", location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="" element={<WrapperUser />}>
        <Route
          path="/dashboard"
          element={<ProtectedUserRoute element={<Dashboard />} />}
        />
        <Route
          path="/process/bmr_process"
          element={<ProtectedUserRoute element={<BMRProcess />} />}
        />
        <Route
          path="/process/bmr_details"
          element={<ProtectedUserRoute element={<BMRDetails />} />}
        />
        <Route
          path="/process/processdetails/:bmr_id"
          element={<ProtectedUserRoute element={<BMRProcessDetails />} />}
        />
        <Route
          path="/bmr_records"
          element={<ProtectedUserRoute element={<BMRRecords />} />}
        />
      </Route>
      <Route
        path="/audit-trail"
        element={<ProtectedUserRoute element={<AuditTrail />} />}
      />
      <Route
        path="/boardOfDirectors"
        element={<ProtectedUserRoute element={<BoardOfDirectors />} />}
      />

      <Route
        path="/bmr-forms"
        element={<ProtectedUserRoute element={<BMRForms />} />}
      />

      <Route path="/help" element={<ProtectedUserRoute element={<Help />} />} />

      <Route
        path="/helpdesk"
        element={<ProtectedUserRoute element={<HelpdeskPersonnel />} />}
      />

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
  );
}

export default App;
