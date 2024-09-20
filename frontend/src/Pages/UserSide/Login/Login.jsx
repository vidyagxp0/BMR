import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaHeartbeat,
  FaNotesMedical,
} from "react-icons/fa";
import {BASE_URL} from "../../../config.json"

const HealthLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [healthTip, setHealthTip] = useState("");
  const navigate = useNavigate();

  const healthTips = [
    " A document designed to provide a complete record of the manufacturing history of a batch of product",
    "The process of transforming raw materials or component parts into finished goods ready to be sold to customers",
    "Batch manufacturing record is a written document from the batch that is prepared during the pharmaceutical manufacturing process.",
    " These records provide a detailed account of the steps, materials, and conditions involved in the production of each batch of a product..",
  ];

  useEffect(() => {
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setHealthTip(randomTip);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/user/user-login`,
        {
          email: credentials.username,
          password: credentials.password,
        }
      );

      const token = response.data.token;
      if (token) {
        localStorage.setItem("user-token", token);
        const decoded = jwtDecode(token);
        localStorage.setItem("user-details", JSON.stringify(decoded));
        toast.success("Login Successful");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    // <div
    //   className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
    //   style={{
    //     backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://media.licdn.com/dms/image/D4E12AQH2Cvxk8R5zsA/article-cover_image-shrink_600_2000/0/1666529530825?e=2147483647&v=beta&t=wcgOIbUQLV3zz5Ad3qpTqUNpgh0AMKn2d6PVR2e2-5c')`,
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundRepeat: "no-repeat",
    //   }}
    // >
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000428] to-[#A6FFCB]">
      <div
        className="bg-gray-100 md p-8 rounded-xl shadow-2xl w-full max-w-md"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="text-center mb-8">
          <FaHeartbeat className="text-5xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome to BMR Portal
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            groups of identical products are produced simultaneously, rather
            than one at a time
          </p>
        </div>

        {/* <BoxModal> */}
        <form
          onSubmit={handleLogin}
          className="space-y-6 p-6 bg-gray-50 rounded-lg "
        >
          {/* Username Input */}
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 px-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none focus:px-8 focus:py-2"
              placeholder="Username"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none focus:px-8 focus:py-2"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3"
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 focus:py-2"
          >
            Sign In
          </button>
        </form>
        {/* </BoxModal> */}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <FaNotesMedical className="text-blue-500 mr-2" />
            <h3 className="font-semibold text-blue-800 text-center">
              What is BMR ?
            </h3>
          </div>
          <p className="text-sm text-gray-600">{healthTip}</p>
        </div>

        {/* <div className="mt-6 text-center">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
          <p className="mt-2 text-sm text-gray-600">
            New to BMR Portal?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default HealthLogin;
