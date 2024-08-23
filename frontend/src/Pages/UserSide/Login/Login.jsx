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
      .post("http://192.168.1.20:7000/user/user-login", data, {
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
      {/* <div
    className="min-h-screen flex items-center justify-center"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://c0.wallpaperflare.com/preview/661/131/640/pharmacist-pharmacy-medicine-man.jpg')`,
      // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://news.mit.edu/sites/default/files/download/201903/MIT-Inactive-Ingredients-PRESS.jpg')`,
      // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://m.economictimes.com/thumb/msid-87799440,width-1200,height-900,resizemode-4,imgsize-29722/pharma-sector-study-will-identify-steps-to-boost-competition-ensure-drug-affordability-cci-chief.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  > */}

      <div
        className="p-8 rounded-lg shadow-lg max-w-md w-full"
        style={{
          backgroundColor: "rgba(120, 120, 120, 0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex justify-center items-center">
          <img src="/vidyalogo2.png" alt="" className="w-80 " />
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
          Welcome To BMR LogIn
        </h2>

        <form onSubmit={handleLogin}>
          <AtmInput
            type="text"
            placeholder="Enter your username"
            className="mb-4 h-[48px] bg-white"
            labelClassName="text-white"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: {
                height: "48px", // Adjust height
              },
            }}
            InputLabelProps={{
              style: {
                top: "0", // Adjust label position
              },
            }}
          />

          <div className="relative mb-4">
            <AtmInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="mb-4 pr-10 h-[48px] bg-white"
              labelClassName="text-white"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: {
                  height: "48px", // Adjust height
                },
              }}
              InputLabelProps={{
                style: {
                  top: "0", // Adjust label position
                },
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 pt-3 cursor-pointer"
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
      <ToastContainer />
    </div>
  );
};

export default Login;
