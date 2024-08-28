import { useState } from "react";
import "./UserVerificationPopUp.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserVerificationPopUp = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [declaration, setDeclaration] = useState("");
  const navigate = useNavigate();

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = {
  //     email: email,
  //     password: password,
  //     declaration: declaration,
  //   };
  //   axios
  //     .post("http://192.168.1.11:7000/user/user-login", data, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       toast.success("Successfully Initiated");
  //       localStorage.setItem("user-token", response.data.token);
  //       const decoded = jwtDecode(response.data.token);
  //       localStorage.setItem("user-details", JSON.stringify(decoded));
  //       navigate("/process/bmr_process");
  //       console.log("successss")
  //     })
  //     .catch((error) => {
  //       toast.error(error.response.data.message);
  //       console.error(error);
  //     });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, declaration })
      .then((response) => {
        console.log(response, "responseee");
      })
      .catch((error) => {
        console.log(error, "error");
      });
    navigate("/process/bmr_process");
  };

  return (
    <div className="popup-overlay z-50">
      <div className="popup">
        <h2>E-signature</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="color-label">
              Email <span className="required-asterisk text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="color-label">
              Password <span className="required-asterisk text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="color-label">
              Declaration{" "}
              <span className="required-asterisk text-red-500">*</span>
            </label>
            <input
              type="text"
              value={declaration}
              onChange={(e) => setDeclaration(e.target.value)}
              required
            />
          </div>
          <div className="popup-buttons">
            <button type="submit" className="btn">
              Submit
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserVerificationPopUp;
