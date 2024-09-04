// AdminLogin.js
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AtmInput from "../../../AtmComponents/AtmInput";
import AtmButton from "../../../AtmComponents/AtmButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: username,
      password: password,
    };
    axios
      .post("http://195.35.6.197:7000/user/admin-login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        localStorage.setItem("admin-token", response.data.token);
        toast.success("Login Successful");
        navigate("/admin-dashboard");
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Login failed");
        console.error(error);
      });
  };

  const backgrounds = [
    "https://c0.wallpaperflare.com/preview/661/131/640/pharmacist-pharmacy-medicine-man.jpg",
    "https://news.mit.edu/sites/default/files/download/201903/MIT-Inactive-Ingredients-PRESS.jpg",
    "https://m.economictimes.com/thumb/msid-87799440,width-1200,height-900,resizemode-4,imgsize-29722/pharma-sector-study-will-identify-steps-to-boost-competition-ensure-drug-affordability-cci-chief.jpg",
  ];

  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundImage(backgrounds[randomIndex]);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />
      <div
        className="p-8 rounded-lg shadow-lg max-w-md w-full"
        style={{
          backgroundColor: "rgba(120, 120, 120, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex justify-center items-center">
          <img src="/vidyalogo2.png" alt="" className="w-80" />
        </div>
        <h2
          className="text-2xl font-[900] mb-6 text-center login"
          style={{
            backgroundImage: `url('https://newsaf.cgtn.com/news/2021-08-12/WHO-announces-three-new-drugs-for-latest-COVID-19-clinical-trials-12EjQYwJFWU/img/162f401916eb4342a9219c7cf7e207c5/162f401916eb4342a9219c7cf7e207c5.jpeg')`,
            backgroundSize: "cover",
            backgroundClip: "text",
            color: "transparent",
            WebkitBackgroundClip: "text",
          }}
        >
          BMR Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <AtmInput
            type="text"
            placeholder="Enter your username"
            className="mb-5 h-[48px] p-3 text-white text-base font-bold bg-transparent border border-gray-600 rounded-md focus:outline-none focus:pl-2 focus:bg-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            labelClassName="text-white"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: {
                height: "48px",
                padding: "0 12px", // Adjust padding
                boxSizing: "border-box", // Ensure padding and border are included in element's total width and height
              },
            }}
            InputLabelProps={{
              style: {
                top: "-8px", // Adjust label position to float above the input
                left: "12px", // Adjust label horizontal position if needed
              },
            }}
          />
          <div className="relative mb-4">
            <AtmInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="mb-5 p-3 h-[48px] text-white text-basey font-bold bg-transparent border border-gray-600 rounded-md focus:outline-none focus:pl-2 focus:bg-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              labelClassName="text-white"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: {
                  height: "48px",
                  padding: "0 12px", // Adjust padding to prevent overlap
                  boxSizing: "border-box", // Ensure padding and border are included in element's total width and height
                },
              }}
              InputLabelProps={{
                style: {
                  top: "-8px", // Adjust label position to float above the input
                  left: "12px", // Adjust label horizontal position if needed
                },
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-7 pt-3 text-white cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="" />
              ) : (
                <FaEye className="" />
              )}
            </button>
          </div>
          <AtmButton label="Login" type="submit" className="w-full mt-4" />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
