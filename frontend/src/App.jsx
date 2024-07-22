import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './Pages/AdminSide/AdminLogin/AdminLogin'
import AdminDashBoard from './Pages/AdminSide/AdminDashBoard/AdminDashBoard'
import { ToastContainer } from 'react-toastify'
import Wrapper from './Pages/Wrapper'
import AddUser from './Pages/AdminSide/AddUser/AddUser'
import UpdateUser from './Pages/AdminSide/Modals/UpdateUserModal'
import Login from './Pages/UserSide/Login/Login'
import Dashboard from './Pages/UserSide/Dashboard/Dashboard'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/admin-login" element={<AdminLogin />} />
          
             <Route path='/' element={<Login/>}  />
             <Route path='/dashboard' element={<Dashboard/>}  />
             <Route path="" element={<Wrapper />}>
            <Route
              path="/admin-dashboard"
              element={<AdminDashBoard />}
            />
            <Route path="/admin-add-user" element={<AddUser />} />
            <Route path="/admin-update-user" element={<UpdateUser />} />

          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>

    </>
  )
}

export default App
