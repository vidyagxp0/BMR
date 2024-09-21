import { useEffect, useState } from "react";
import "./UserVerificationPopUp.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.json";

const UserVerificationPopUp = ({
  onClose,
  onSubmit,
  onVerificationSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [declaration, setDeclaration] = useState("");
  const [comments, setComments] = useState("");

  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);

  const handleFlag = () => {
    setFlag(true);
    console.log("Flag is set to true", flag);
    navigate("/process/bmr_process");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, declaration, comments }, handleFlag);

    setFlag(!false);
  };

  return (
    <div className="popup-overlay  z-50">
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
              style={{ border: "1px solid gray", height: "40px" }}
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
              style={{ border: "1px solid gray", height: "40px" }}
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
              style={{ border: "1px solid gray", height: "40px" }}
              required
            />
          </div>
          <div className="form-group">
            <label className="color-label">
              Comment <span className="required-asterisk text-red-500">*</span>
            </label>
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              style={{ border: "1px solid gray", height: "40px" }}
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
