import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "./HeaderTop.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaPeopleLine } from "react-icons/fa6";

import {
  FaCog,
  FaGlobe,
  FaHandsHelping,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
function HeaderTop() {
  const navigate = useNavigate();
  const [User, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("admin-token");
    navigate("/");
  };

  // const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);
  // useEffect(() => {
  //   const requestOptions = {
  //     method: "GET",
  //     url: `http://localhost:7000:1000/user/get-a-user/${loggedInUser?.userId}`, 
  //     headers: {}, 
  //   };

  //   axios(requestOptions)
  //     .then((response) => {
  //       setUser(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("user-token");
  //   localStorage.removeItem("admin-token");
  //   navigate("/");
  // };

  return (
    <>
      <div id="Header_Top" className="Header_Top bg-white">
        <div className="header_inner">
          <div className="left">
            <div className="logo">
              {/* <img src="/logo1.png" alt="..." /> */}
              <img
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
                src="/vidyalogo2.png"
                alt="..."
              />
            </div>
          </div>
          <div className="center">
            <div className="inputContainer">
              <div className="inputInnerLeft">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#207ec6"
                  width={"25"}
                  height={"25"}
                >
                  <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                </svg>
              </div>
              <div className="inputInnerRight flex flex-row">
                <input type="search" />
                <button
                  className=""
                  style={{ width: "30%", marginLeft: "20%", padding: "3%" }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="bellLeft">
              <i className="ri-notification-3-fill"></i>
            </div>
            <div className="mr-8">
              <p className="text-black font-semibold font-serif mt-2 ">
                Anshul Thakur
              </p>
            </div>
            <div className="drop-container">
              <div className="drop-btn name-btn ">
                <div className="profile-img">
                  {/* <img src={User?.profile_pic} alt="Profile Picture" /> */}
                </div>
              </div>
              <div className="drop-list">
                {/* <div className="image">
                <img src={User?.profile_pic} alt="Profile Picture" /> 
                <div className="manager-name">{User?.name}</div>
                </div> */}
                <Link to="/boardOfDirectors" className="drop-item">
                  <FaPeopleLine size={24} />
                  <div style={{ paddingLeft: "10px" }}>Board Members</div>
                </Link>
                <Link to="/about" className="drop-item">
                  <FaGlobe size={24} />
                  <div style={{ paddingLeft: "10px" }}>About</div>
                </Link>
                <Link to="/help" className="drop-item">
                  <FaHandsHelping size={24} />
                  <div style={{ paddingLeft: "10px" }}>Help</div>
                </Link>
                <Link to="/helpdesk" className="drop-item">
                  <FaHeadset size={24} />
                  <div style={{ paddingLeft: "10px" }}>Helpdesk Personnel</div>
                </Link>
                <Link to="/" className="drop-item" onClick={handleLogout}>
                  <FaSignOutAlt size={24} />
                  <div style={{ paddingLeft: "10px" }}>Logout</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderTop;
