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
// import About from "./Pages/HeaderComponents/About";
import About from "./Pages/HeaderComponents/About";
import Help from "./Pages/HeaderComponents/Help";
import HelpdeskPersonnel from "./Pages/HeaderComponents/HelpdeskPersonnel";
import BoardOfDirectors from "./Pages/HeaderComponents/BoardOfDirectors";
import AuditTrail from "./Pages/UserSide/auditTrail/auditTrail";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Notifications from "./Pages/UserSide/Notifications/Notifications";
import BMRForms from "./Pages/UserSide/pages/Process/Modals/BMRForms";
import Analytics from "./Pages/UserSide/Analytics/Analytics";
import Logs from "./Pages/UserSide/Logs/Logs";
import BMRRecordsDetails from "./Pages/UserSide/pages/BMRRecordsDetails/BMRRecordsDetails";
import Messenger from "./Pages/UserSide/Messenger/Messenger";
import ChatWindow from "./Pages/UserSide/Messenger/ChatWindow";

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
      const currentPath = location.pathname;

      if (currentPath === "/admin-dashboard" || currentPath === "/dashboard") {
        // Disable back button on admin-dashboard and dashboard
        window.history.pushState(null, "", currentPath);
        window.history.pushState(null, "dashboard", currentPath);
      } else if (currentPath.startsWith("/admin")) {
        // Redirect to admin-dashboard when navigating back from any admin route
        navigate("/admin-dashboard", { replace: true });
      } else {
        // You can handle other custom logic here
        console.log("Navigating in user routes");
      }
    };

    // Add event listener to handle back navigation
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handlePopState = (event) => {
      const currentPath = location.pathname;

      // If the user is on `/process/processdetails/:bmr_id`, redirect to `/process/bmr_process`
      if (currentPath.startsWith("/process/processdetails/")) {
        navigate("/process/bmr_process", { replace: true });
      }

      // If the user is on `/process/bmr_process`, redirect to `/dashboard`
      else if (currentPath === "/process/bmr_process") {
        navigate("/dashboard", { replace: true });
      }

      // If the user is on `/dashboard`, do nothing (prevent them from going back)
      else if (currentPath === "/dashboard") {
        window.history.pushState(null, "", "/dashboard");
      }
    };

    // Listen for back button clicks (popstate event)
    window.addEventListener("popstate", handlePopState);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handlePopState = (event) => {
      // Check if the user is not on the dashboard or login page
      if (location.pathname !== "/dashboard" && location.pathname !== "/") {
        // Redirect the user to the dashboard and replace the history state
        navigate("/dashboard", { replace: true });
      } else if (location.pathname === "/dashboard") {
        // If user is on the dashboard, prevent the back button by pushing the dashboard state
        window.history.pushState(null, "", "/dashboard");
      }
    };

    // Add an event listener for the popstate event (browser back button)
    window.addEventListener("popstate", handlePopState);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Disable the back button when on the dashboard by overriding the back navigation behavior
    if (location.pathname === "/dashboard") {
      window.history.pushState(null, "", "/dashboard");

      const disableBackButton = () => {
        window.history.pushState(null, "", "/dashboard");
      };

      window.addEventListener("popstate", disableBackButton);

      return () => {
        window.removeEventListener("popstate", disableBackButton);
      };
    }
  }, [location.pathname]);

  useEffect(() => {
    // Ensure that when the location changes, the current state is pushed to the history stack
    if (location.pathname !== "/" && location.pathname !== "/dashboard") {
      window.history.pushState(null, "", location.pathname);
    }
  }, [location.pathname]);

  // Optional: useEffect specifically to lock the user on the dashboard
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      // Add additional logic to handle history when the user is on the dashboard
      window.history.pushState(null, "", "/dashboard");

      // Disable the back button by setting a custom state and preventing back navigation
      const disableBackNavigation = () => {
        window.history.pushState(null, "", "/dashboard");
      };

      // Override the back button behavior to prevent going back from the dashboard
      window.onpopstate = function () {
        window.history.go(1); // Prevent navigating back
      };

      // Add event listener for the popstate event to handle the back button
      window.addEventListener("popstate", disableBackNavigation);

      return () => {
        window.removeEventListener("popstate", disableBackNavigation);
      };
    }
  }, [location.pathname]);
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
        <Route
          path="/bmr_records/bmr_records_details/:record_id"
          element={<ProtectedUserRoute element={<BMRRecordsDetails />} />}
        />
        <Route
          path="/user-notifications"
          element={<ProtectedUserRoute element={<Notifications />} />}
        />
        <Route
          path="/messenger"
          element={<ProtectedUserRoute element={<Messenger />} />}
        />
        <Route
          path="/chat/:userId"
          element={<ProtectedUserRoute element={<ChatWindow />} />}
        />
        <Route
          path="/analytics"
          element={<ProtectedUserRoute element={<Analytics />} />}
        />
        <Route
          path="/logs"
          element={<ProtectedUserRoute element={<Logs />} />}
        />
        <Route
          path="/bmr-forms"
          element={<ProtectedUserRoute element={<BMRForms />} />}
        />
        <Route
          path="/bmr-details/:bmr_id" // Route to handle BMR details
          element={<ProtectedUserRoute element={<BMRDetails />} />} // Render the BMRDetails component
        />
         <Route
        path="/audit-trail"
        element={<ProtectedUserRoute element={<AuditTrail />} />}
      />
      <Route
        path="/boardOfDirectors"
        element={<ProtectedUserRoute element={<BoardOfDirectors />} />}
      />
      <Route path="/help" element={<ProtectedUserRoute element={<Help />} />} />
      <Route
        path="/about"
        element={<ProtectedUserRoute element={<About />} />}
      />

      <Route
        path="/helpdesk"
        element={<ProtectedUserRoute element={<HelpdeskPersonnel />} />}
      />
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
  );
}

export default App;
