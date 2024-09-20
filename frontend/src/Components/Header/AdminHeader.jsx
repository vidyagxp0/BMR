import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("user-token");
    navigate("/");
    window.location.reload();
  };

  const handleShowModal = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="main-header bg-[#346C86]">
        <div className="inner-grid flex items-center justify-between">
          <div className="w-44">
            <img src="/headerlogo.png" alt="Logo" />
          </div>
          {/* <div className="relative">
            <div className="flex items-center cursor-pointer">
              <img
                className="w-10 h-10 rounded-full"
                src="/amit_guru.jpg"
                alt="User Avatar"
              />
              <div className="ml-2 text-white">Mr. Amit Guru</div>
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <div className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <InfoIcon />
                  <span>About</span>
                </div>
              </div>
              <Link to="#" className="block px-4 py-2">
                <div className="flex items-center space-x-2">
                  <ContactSupportIcon />
                  <span>Help</span>
                </div>
              </Link>
              <button
                onClick={handleShowModal}
                className="block w-full px-4 py-2 text-left"
              >
                <div className="flex items-center space-x-2">
                  <LogoutIcon />
                  <span>Logout</span>
                </div>
              </button>
              <Link className="block px-4 py-2">
                <div className="flex items-center space-x-2">
                  <ManageAccountsIcon />
                  <span>Settings</span>
                </div>
              </Link>
            </div>
          </div> */}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleLogOut}
              >
                Yes, Logout
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
