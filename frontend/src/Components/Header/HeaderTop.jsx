import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
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
    setSocket(socketIOClient("http://localhost:7000/"));
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

        <div className="right">
          <div className="links-container mr-10">
            <Link
              to="/user-notifications"
              className="flex items-center mt-8  space-x-1"
            >
              <div className="relative">
                <FaBell className="text-white text-2xl" />{" "}
                <span className="link-name">Notifications</span>
                {/* Increased size to 32x32 pixels */}
                {unreadCount > 0 && (
                  <span className="absolute -top-2 left-2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
                
              </div>

              
            </Link>

            <Link to="/boardOfDirectors" className="link-item mt-5 ">
              <FaPeopleLine className="text-white text-2xl" />
              <span className="link-name">Board Members</span>
            </Link>
            <Link to="/about" className="link-item mt-8 ">
              <FaGlobe className="text-white text-2xl" />
              <span className="link-name">About</span>
            </Link>
            <Link to="/help" className="link-item mt-8 ">
              <FaHandsHelping className="text-white text-2xl" />
              <span className="link-name">Help</span>
            </Link>
            <Link to="/helpdesk" className="link-item mt-8 ">
              <FaHeadset className="text-white text-2xl" />
              <span className="link-name">Helpdesk Personnel</span>
            </Link>
            <Link to="/" className="link-item mt-8 " onClick={handleLogout}>
              <FaSignOutAlt className="text-white text-2xl" />
              <span className="link-name">Logout</span>
            </Link>
          </div>
          <div className="flex items-center justify-end">
            {/* Admin Name */}
            <div className="mr-4 mt-5 text-white">Admin</div>

            {/* Profile Picture Placeholder */}
            <div className="rounded-full w-12 h-12 bg-gray-400 flex items-center justify-center">
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
