// AdminLogin.js
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AtmInput from '../../../AtmComponents/AtmInput';
import AtmButton from '../../../AtmComponents/AtmButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: username,
      password: password,
    };
    axios
      .post("http://192.168.1.16:7000/user/admin-login", data, {
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

  return (
    <div
    className="min-h-screen flex items-center justify-center"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://c0.wallpaperflare.com/preview/661/131/640/pharmacist-pharmacy-medicine-man.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
     <ToastContainer />
    <div className="p-8 rounded-lg shadow-lg max-w-md w-full" style={{
      backgroundColor: 'rgba(120, 120, 120, 0.2)',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="flex justify-center items-center">
      <img src="/vidyalogo2.png" alt="" className='w-80 '/>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">BMR Admin Login</h2>
      
      <form onSubmit={handleLogin}>
        <AtmInput
          type="text"
          placeholder="Enter your username"
          className="mb-4"
          labelClassName="text-white"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-4">
            <AtmInput
              type={showPassword ? "text" : "password"} // Toggle input type based on state
              placeholder="Enter your password"
              className="mb-4 pr-10" // Add padding-right to make space for the icon
              labelClassName="text-white"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute inset-y-0 right-0 flex items-center px-3 pt-3 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash className="" /> : <FaEye className="" />}
            </button>
          </div>
        <AtmButton
          label="Login"
          type="submit"
          className="w-full mt-4"
        />
      </form>
    </div>
   
  </div>
  );
};

export default AdminLogin;
