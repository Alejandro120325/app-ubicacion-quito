import React from "react";
import {
  LayoutDashboard,
  LogOut,
  MapPinned,
  Radar,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "./Button.jsx";

const getLinks = (role) => {
  if (role === "admin") {
    return [
      {
        to: "/admin/dashboard",
        label: "Panel admin",
        icon: LayoutDashboard
      }
    ];
  }

  return [
    {
      to: "/persona/dashboard",
      label: "Mi panel",
      icon: UserRound
    }
  ];
};

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-950 p-4 text-white shadow-soft">
          <span className="rounded-lg bg-sky-500 p-2 shadow-glow">
            <MapPinned className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Quito Ubicacion</p>
            <p className="text-xs text-slate-300">Seguimiento simulado</p>
          </div>
        </div>

        <nav className="mt-4 grid gap-2">
          {getLinks(user?.role).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900 lg:mt-auto">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Sesion activa
          </div>
          <p>{user?.fullName}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-teal-700">
            Rol: {user?.role}
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Radar className="h-4 w-4 text-sky-600" aria-hidden="true" />
            Datos de demostracion
          </div>
          <p className="mt-1 leading-5">No se usan mapas reales ni base de datos.</p>
        </div>

        <Button className="mt-4 w-full" icon={LogOut} variant="secondary" onClick={handleLogout}>
          Cerrar sesion
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
