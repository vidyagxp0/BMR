import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSide/userSidebar/UserSidebar';
import HeaderTop from '../Components/Header/HeaderTop';

const WrapperUser = () => {
  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow mt-16">
        {/* Sidebar */}
        <div className="fixed top-16 left-0 w-64 h-full z-40 hidden lg:block">
          <UserSidebar />
        </div>

        {/* Outlet for rendering content */}
        <div className="flex-grow ml-0 lg:ml-64 p-4 w-full relative overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default WrapperUser;
