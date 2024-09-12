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
    setSocket(socketIOClient("https://bmrapi.mydemosoftware.com/"));
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
            <Link to="/user-notifications" className="link-item mt-5 ">
              <FaBell size={22} />
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
              <span className="link-name">Notifications</span>
            </Link>
            <Link to="/boardOfDirectors" className="link-item mt-5 ">
              <FaPeopleLine size={22} />
              <span className="link-name">Board Members</span>
            </Link>
            <Link to="/about" className="link-item mt-5 ">
              <FaGlobe size={22} />
              <span className="link-name">About</span>
            </Link>
            <Link to="/help" className="link-item mt-5 ">
              <FaHandsHelping size={22} />
              <span className="link-name">Help</span>
            </Link>
            <Link to="/helpdesk" className="link-item mt-5 ">
              <FaHeadset size={22} />
              <span className="link-name">Helpdesk Personnel</span>
            </Link>
            <Link to="/" className="link-item mt-5 " onClick={handleLogout}>
              <FaSignOutAlt size={22} />
              <span className="link-name">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderTop;
