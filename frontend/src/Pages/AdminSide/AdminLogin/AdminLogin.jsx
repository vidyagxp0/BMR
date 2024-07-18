// AdminLogin.js
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AtmInput from '../../../AtmComponents/AtmInput';
import AtmButton from '../../../AtmComponents/AtmButton';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Basic validation for demonstration (replace with actual login logic)
    if (username === 'Mayank' && password === 'Mayank') {
      toast.success('Logged in successfully!');
      // Redirect or perform further actions upon successful login
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://png.pngtree.com/thumb_back/fw800/background/20240408/pngtree-t-a-scene-of-snow-covered-pine-fores-with-wooden-benches-image_15710029.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
      }}
    >
      <div className=" p-8 rounded-lg shadow-lg max-w-md w-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <AtmInput
            type="text"
            placeholder="Enter your username"
            className="mb-4"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <AtmInput
            type="password"
            placeholder="Enter your password"
            className="mb-4"
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
