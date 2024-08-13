
import "./AdminHeader.css";
import { Link, useNavigate } from "react-router-dom";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const AdminHeader=()=> {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("user-token");
    navigate("/");
    window.location.reload();
  };


  return (
    <>
      <header className="main-header border border-blue-600 bg-white">
        <div className="inner-grid">
          <div className="logo">
            <img src="/headerlogo.png" alt="..." />
          </div>
          <div className="drop-container">
            <div className="drop-btn name-btn">
              <div className="profile-img">
                <img
                  id="avatarButton"
                  type="button"
                  //   onClick={}
                  className="w-11 h-11 rounded-full cursor-pointer"
                  src="/amit_guru.jpg"
                  alt="User dropdown"
                />
              </div>
            </div> 
            <div className="drop-list">
              <div className="image">
                <div className="manager-name">Mr.Amit Guru</div>
              </div>
              <div
                to="#"
                className="drop-item"
              >
                <InfoIcon /> About
              </div>
              <Link to="#" className="drop-item">
                <ContactSupportIcon />
                Help
              </Link>
              <Link onClick={handleLogOut} className="drop-item">
                <LogoutIcon />
                Logout
              </Link>
              <Link className="drop-item">
                <ManageAccountsIcon />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default AdminHeader;