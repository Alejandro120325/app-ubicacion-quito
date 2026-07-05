import React from "react";
import { LogIn, LogOut, MapPin, UserPlus } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import Button from "./Button.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--glass-background)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-2 font-bold text-[var(--color-text)]" to="/">
          <span className="rounded-lg bg-[var(--color-primary)] p-2 text-white shadow-sm">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden truncate sm:inline">{t("app.name")}</span>
          <span className="hidden truncate min-[440px]:inline sm:hidden">Quito</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector compact />
          <ThemeToggle compact />
          {isAuthenticated ? (
            <>
              <NavLink
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-soft)] hover:text-[var(--color-text)] sm:block"
                to={user.role === "admin" ? "/admin/dashboard" : "/persona/dashboard"}
              >
                {user.role === "admin" ? t("sidebar.adminPanel") : t("sidebar.myPanel")}
              </NavLink>
              <Button icon={LogOut} size="sm" variant="dark" onClick={handleLogout}>
                {t("sidebar.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button icon={LogIn} size="sm" to="/login" variant="ghost">
                {t("nav.signIn")}
              </Button>
              <Button icon={UserPlus} size="sm" to="/register">
                {t("nav.register")}
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
