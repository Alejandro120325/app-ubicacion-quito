import React from "react";
import { LogIn, LogOut, MapPin, UserPlus } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "./Button.jsx";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 font-bold text-quito-navy" to="/">
          <span className="rounded-lg bg-quito-blue p-2 text-white">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">Quito Ubicacion Segura</span>
          <span className="sm:hidden">Quito Segura</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:block"
                to={user.role === "admin" ? "/admin/dashboard" : "/persona/dashboard"}
              >
                Panel
              </NavLink>
              <Button icon={LogOut} size="sm" variant="dark" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button icon={LogIn} size="sm" to="/login" variant="ghost">
                Entrar
              </Button>
              <Button icon={UserPlus} size="sm" to="/register">
                Registro
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
