import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './Pages/AdminSide/AdminLogin/AdminLogin'
import AdminDashBoard from './Pages/AdminSide/AdminDashBoard/AdminDashBoard'
import { ToastContainer } from 'react-toastify'
import Wrapper from './Pages/Wrapper'
import AddUser from './Pages/AdminSide/AddUser/AddUser'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="" element={<Wrapper />}>
            <Route
              path="/admin-dashboard"
              element={<AdminDashBoard />}
            />
            <Route path="/admin-add-user" element={<AddUser />} />

          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>

    </>
  )
}

export default App
