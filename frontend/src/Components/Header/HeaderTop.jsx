import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaGlobe,
  FaHandsHelping,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import socketIOClient from "socket.io-client";
import "./Header.css";
import "./HeaderTop.css";

function HeaderTop() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(socketIOClient("http://192.168.1.26:7000/"));
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

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("admin-token");
    localStorage.removeItem("user-details");
    navigate("/");
  };

  return (
    <div id="Header_Top" className="Header_Top ">
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

            <Link
              to="/boardOfDirectors"
              className="link-item mt-5 flex items-center space-x-2"
            >
              <FaPeopleLine className="text-white text-2xl mt-3" />
              <span className="link-name text-white">Board Members</span>
            </Link>

            <Link
              to="/about"
              className="link-item mt-8 flex items-center space-x-2"
            >
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
            <div className="mr-4 mt-5 text-white">Admin</div>
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
    </div>
  );
}

export default HeaderTop;
