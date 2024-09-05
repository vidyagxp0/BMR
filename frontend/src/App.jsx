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

function App() {
  return (
    <>
      <BrowserRouter>
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
          <Route path="/boardOfDirectors" element={<BoardOfDirectors />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/helpdesk" element={<HelpdeskPersonnel />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
