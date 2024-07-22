// AdminLogin.js
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AtmInput from '../../../AtmComponents/AtmInput';
import AtmButton from '../../../AtmComponents/AtmButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();
    const data = {
      email: username,
      password: password,
    };
    axios
      .post("http://192.168.1.35:7000/user/admin-login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/admin-dashboard");
        toast.success("Login Successful");
        localStorage.setItem("admin-token", response.data.token);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://c4.wallpaperflare.com/wallpaper/328/20/845/the-sky-stars-trees-night-wallpaper-preview.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
      }}
    >
      <div className=" p-8 rounded-lg shadow-lg max-w-md w-full" style={{ backgroundColor: 'rgba(120, 120, 120, 0.2)' }}>
        <h2 className="text-2xl font-bold mb-6 text-center">BMR Admin Login</h2>
        
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
          <AtmInput
            type="password"
            placeholder="Enter your password"
            className="mb-4"
             labelClassName="text-white"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <AtmButton
            label="Login"
            type="submit"
            className="w-full mt-4"
          />
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default AdminLogin;
