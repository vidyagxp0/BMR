import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// import { asideLinks } from "./UserSidebarData";
import asideLinks from "../../Pages/UserSide/userSidebar/UserSidebarData";
import { FaPeopleLine } from "react-icons/fa6";
import {
  // FaCog,
  FaGlobe,
  FaHandsHelping,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaChevronDown, FaChevronUp, FaBell } from "react-icons/fa";
import "./Header.css";
import "./HeaderTop.css";
import axios from "axios";

function HeaderTop() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState({});
  const [User, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("admin-token");
    navigate("/");
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

        {/* <div className="center ">
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

        {/* <div className=" flex items-center justify-center w-72 -ml-10  gap-10">
          {Each({
            of: asideLinks,
            render: (item) => (
              <div className="sidebar-link mt-8" key={item.id}>
                {item.hasChild ? (
                  <div
                    className={`link-head ${
                      isParentActive(item.child) ? "active-link" : ""
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div>
                      {item.icon}
                      <div className="title">{item.title}</div>
                    </div>
                    {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                ) : (
                  <Link
                    to={item.link}
                    className={({ isActive }) =>
                      isActive
                        ? "link-head active-link"
                        : "link-head inactive-link"
                    }
                  >
                    <div>
                      {item.icon}
                      <div className="title">{item.title}</div>
                    </div>
                  </Link>
                )}
                {item.hasChild && openItems[item.id] && (
                  <div className="sidebar-subList">
                    {item.child
                      ? Each({
                          of: item.child,
                          render: (child) => (
                            <Link
                              to={child.link}
                              className={({ isActive }) =>
                                isActive
                                  ? "sidebar-subLink active-subLink"
                                  : "sidebar-subLink inactive-subLink"
                              }
                            >
                              <span className="flex items-center">
                                {child.icon}&nbsp;{child.title}
                              </span>
                            </Link>
                          ),
                        })
                      : ""}
                  </div>
                )}
              </div>
            ),
          })}
        </div> */}

        <div className="right">
          <div className="notification-icon  relative">
            <FaBell className="text-black text-2xl" />
            <span className="absolute -top-2 left-2  bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
              2
            </span>
          </div>

          <div className="links-container mr-10">
            <Link to="/boardOfDirectors" className="link-item mt-8 ">
              <FaPeopleLine size={22} />
              <span className="link-name">Board Members</span>
            </Link>
            <Link to="/about" className="link-item mt-8 ">
              <FaGlobe size={22} />
              <span className="link-name">About</span>
            </Link>
            <Link to="/help" className="link-item mt-8 ">
              <FaHandsHelping size={22} />
              <span className="link-name">Help</span>
            </Link>
            <Link to="/helpdesk" className="link-item mt-8 ">
              <FaHeadset size={22} />
              <span className="link-name">Helpdesk Personnel</span>
            </Link>
            <Link to="/" className="link-item mt-8 " onClick={handleLogout}>
              <FaSignOutAlt size={22} />
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
