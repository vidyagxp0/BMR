import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSide/userSidebar/UserSidebar';
import HeaderTop from '../Components/Header/HeaderTop';
import DashboardBottom from '../Components/Header/DashboardBottom';
import AdminHeader from '../Components/Header/AdminHeader';

const WrapperUser = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50">
        <HeaderTop />
        <div className="mt-20">
          <DashboardBottom />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-grow mt-[7rem] lg:mt-[7rem]">
        {/* Sidebar */}
        <div className="mt-10">
        <div className="fixed left-0 top-10   w-64 h-full z-40 hidden lg:block">
          <UserSidebar />
        </div>
        </div>
      

        {/* Outlet */}
        <section className="flex-grow ml-0 lg:ml-64 bg-[#e5faef] p-4 overflow-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default WrapperUser;
