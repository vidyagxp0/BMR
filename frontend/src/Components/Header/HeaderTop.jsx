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
  const [socket, setSocket] = useState(null);

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
      return () => {
        socket.off("new_notification");
      };
    }
  }, [socket]);
  const [openItems, setOpenItems] = useState({});
  const [User, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

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

  const toggleItem = (id) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const Each = ({ render, of }) => of.map((item, index) => render(item, index));

  const isParentActive = (children) => {
    // Implement logic to determine if any child link is active
    // e.g., based on current path or some other condition
    return children.some((child) => child.link === location.pathname);
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
              <FaBell className="text-white text-2xl" />
              <span className="link-name text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 left-6 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            {/* <div className="center">
          <div className="inputContainer border-2 border-gray-500 w-96">
            <div className="inputInnerLeft">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#1a9e66"
                width={"25"}
                height={"25"}
              >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
              </svg>
            </div>
            <input type="search" placeholder="Search..." />
            <button className="search-button">Search</button>
          </div>
        </div> */}

            <Link
              to="/boardOfDirectors"
              className="link-item mt-5 flex items-center space-x-2"
            >
              <FaPeopleLine className="text-white text-2xl mt-3" />
              <span className="link-name text-white">Board Members</span>
            </Link>

            <Link to="/messenger" className="link-item mt-5 ">
              <FaMessage className="text-white text-2xl" />
              <span className="link-name">Messenger</span>
            </Link>
            <Link to="/boardOfDirectors" className="link-item mt-5 ">
              <FaPeopleLine className="text-white text-2xl" />
              <span className="link-name">Board Members</span>
            </Link>
            <Link to="/about" className="link-item mt-8 items-center space-x-2">
              <FaGlobe className="text-white text-2xl" />
              <span className="link-name text-white">About</span>
            </Link>

            <Link
              to="/help"
              className="link-item mt-8 flex items-center space-x-2"
            >
              <FaHandsHelping className="text-white text-2xl" />
              <span className="link-name text-white">Help</span>
            </Link>

            <Link
              to="/helpdesk"
              className="link-item mt-8 flex items-center space-x-2"
            >
              <FaHeadset className="text-white text-2xl" />
              <span className="link-name text-white">Helpdesk Personnel</span>
            </Link>

            <Link
              to="/"
              className="link-item mt-8 flex items-center space-x-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-white text-2xl" />
              <span className="link-name text-white">Logout</span>
            </Link>
          </div>

          {/* Admin Section */}
          <div className="flex items-center">
            <div className="mr-4 mt-5 text-white">User</div>
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
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
