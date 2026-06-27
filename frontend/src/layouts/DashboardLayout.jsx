import React from "react";
import { Outlet } from "react-router-dom";
import MobileNav from "../components/MobileNav.jsx";
import Sidebar from "../components/Sidebar.jsx";

const DashboardLayout = () => (
  <div className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
    <MobileNav />
    <div className="lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
