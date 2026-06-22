import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const DashboardLayout = () => (
  <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] lg:flex">
    <Sidebar />
    <main className="min-w-0 flex-1 p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-28">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
