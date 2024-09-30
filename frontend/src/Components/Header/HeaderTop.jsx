import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaGlobe,
  FaHandsHelping,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaPeopleLine, FaMessage } from "react-icons/fa6";
import socketIOClient from "socket.io-client";
import "./Header.css";
import "./HeaderTop.css";
import { BASE_URL } from "../../config.json";

function HeaderTop() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  // const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setSocket(socketIOClient(`${BASE_URL}/`));
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user-details"));
    if (socket && userDetails) {
      socket.emit("register", userDetails.userId);
      socket.on("new_notification", () => {
        setUnreadCount((prev) => prev + 1);
      });
      // socket.on("updateUnreadCount", (count) => {
      //   setUnreadMessageCount(count);
      // });
      return () => {
        socket.off("new_notification");
        // socket.off("updateUnreadCount");
      };
    }
  }, [socket]);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("admin-token");
    localStorage.removeItem("user-details");
    navigate("/");
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    handleLogout();
    handleCloseModal();
  };

  return (
    <div id="Header_Top" className="Header_Top">
      <div className="header_inner">
        <div className="left">
          <div className="logo">
            <img
              onClick={() => navigate("/dashboard")}
              style={{ cursor: "pointer" }}
              src="/vidyalogo2.png"
              alt="Logo"
            />
          </div>
        </div>

        <div className="right flex items-center ">
          {/* Links Container */}
          <div className="links-container mr-10">
            <Link to="/user-notifications" className="link-item mt-8">
              <FaBell className="text-black text-2xl" />
              <span className="link-name text-black">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 left-6 bg-red-500 text-black text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link to="/messenger" className="link-item mt-8 ">
              <FaMessage className="text-black text-2xl" />
              <span className="link-name">Messenger</span>
              {/* {unreadMessageCount > 0 && (
                <span className="absolute -top-2 left-6 bg-red-500 text-black text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadMessageCount}
                </span>
              )} */}
            </Link>
            <Link to="/boardOfDirectors" className="link-item mt-8 ">
              <FaPeopleLine className="text-black text-2xl" />
              <span className="link-name">Board Members</span>
            </Link>
            <Link to="/about" className="link-item mt-8 items-center space-x-2">
              <FaGlobe className="text-black text-2xl" />
              <span className="link-name text-black">About</span>
            </Link>

            <Link
              to="/help"
              className="link-item mt-8 flex items-center space-x-2"
            >
              <FaHandsHelping className="text-black text-2xl" />
              <span className="link-name text-black">Help</span>
            </Link>

            <Link
              to="/helpdesk"
              className="link-item mt-8 flex items-center space-x-2"
            >
              <FaHeadset className="text-black text-2xl" />
              <span className="link-name text-black">Helpdesk Personnel</span>
            </Link>

            <Link
              to="/"
              className="link-item mt-8 flex items-center space-x-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-black text-2xl" />
              <span className="link-name text-black">Logout</span>
            </Link>
          </div>

          {/* Admin Section */}
          <div className="flex items-center">
            <div className="mr-4 mt-5 text-black">User</div>
            <div className="rounded-full w-12 h-12 bg-gray-400 flex items-center justify-center overflow-hidden">
              <img
                className="rounded-full w-full h-full object-cover"
                src="amit_guru.jpg"
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </div>

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
                className="px-4 py-2 bg-red-600 text-black rounded hover:bg-red-700"
                onClick={confirmLogout}
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
    </div>
  );
}

export default HeaderTop;
