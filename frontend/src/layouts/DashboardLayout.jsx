import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-50 lg:flex">
    <Sidebar />
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
