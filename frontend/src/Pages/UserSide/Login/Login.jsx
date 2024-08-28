import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AtmButton from "../../../AtmComponents/AtmButton";
import AtmInput from "../../../AtmComponents/AtmInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Login = () => {
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
      .post("http://195.35.6.197:7000/user/user-login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/dashboard");
        toast.success("Login Successful");
        localStorage.setItem("user-token", response.data.token);

        const decoded = jwtDecode(response.data.token);

        // Storing the decoded user details in local storage
        localStorage.setItem("user-details", JSON.stringify(decoded));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error, "Error in toast");
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="p-8 rounded-lg shadow-2xl max-w-md w-full"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex justify-center items-center mb-4">
          <img src="/vidyalogo2.png" alt="Logo" className="w-60 h-auto" />
        </div>
        <h2
          className="text-3xl font-extrabold mb-6 text-center"
          style={{
            backgroundImage: `url('https://newsaf.cgtn.com/news/2021-08-12/WHO-announces-three-new-drugs-for-latest-COVID-19-clinical-trials-12EjQYwJFWU/img/162f401916eb4342a9219c7cf7e207c5/162f401916eb4342a9219c7cf7e207c5.jpeg')`,
            backgroundSize: "cover",
            backgroundClip: "text",
            color: "transparent",
            WebkitBackgroundClip: "text",
            letterSpacing: "1px",
          }}
        >
          Welcome To BMR Login
        </h2>

        <form onSubmit={handleLogin}>
          <AtmInput
            type="text"
            placeholder="Enter your username"
            className="mb-4 h-[48px] p-4 text-white text-lg font-semibold bg-transparent border border-gray-500 rounded-lg focus:outline-none focus:pl-4 focus:bg-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all"
            labelClassName="text-white"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: {
                height: "48px",
                padding: "0 16px",
                boxSizing: "border-box",
              },
            }}
            InputLabelProps={{
              style: {
                top: "-8px",
                left: "16px",
              },
            }}
          />

          <div className="relative mb-5">
            <AtmInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-[48px] p-4 text-white text-lg font-semibold bg-transparent border border-gray-500 rounded-lg focus:outline-none focus:pl-4 focus:bg-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all"
              labelClassName="text-white"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: {
                  height: "48px",
                  padding: "0 16px",
                  boxSizing: "border-box",
                },
              }}
              InputLabelProps={{
                style: {
                  top: "-8px",
                  left: "16px",
                },
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-5 top-3 flex items-center px-4 pt-3 text-white cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <AtmButton
            label="Login"
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-lg font-bold rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all"
          />
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
