import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, MapPinned, Menu, ShieldCheck, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getDashboardLinks } from "../utils/dashboardNavigation.js";
import Button from "./Button.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const MobileNav = () => {
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--glass-background)] backdrop-blur-xl lg:hidden">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4">
        <button
          aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] text-[var(--color-text)] focus-ring"
          type="button"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-lg bg-[var(--color-primary)] p-2 text-white shadow-sm">
            <MapPinned className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--color-text)]">
              {t("app.shortName")}
            </p>
            <p className="truncate text-xs text-[var(--color-muted)]">{t("app.demo")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <ThemeToggle compact />
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              aria-label={t("common.closeMenu")}
              className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed bottom-0 left-0 top-0 z-50 flex w-[min(88vw,340px)] flex-col border-r border-[var(--color-border)] bg-[var(--glass-background)] p-4 text-[var(--color-text)] shadow-soft backdrop-blur-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{t("app.shortName")}</p>
                  <p className="text-xs text-[var(--color-muted)]">{t("sidebar.session")}</p>
                </div>
                <button
                  aria-label={t("common.closeMenu")}
                  className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-soft)] focus-ring"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav className="mt-5 grid gap-2">
                {getDashboardLinks(user?.role, t).map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      className={({ isActive }) =>
                        `flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                          isActive
                            ? "bg-[var(--color-soft)] text-[var(--color-primary)]"
                            : "text-[var(--color-muted)] hover:bg-[var(--color-soft)] hover:text-[var(--color-text)]"
                        }`
                      }
                      end={item.to === "/"}
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="mt-auto grid gap-3">
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-[var(--color-secondary)]" aria-hidden="true" />
                    {t("sidebar.session")}
                  </div>
                  <p className="mt-2 truncate">{user?.fullName}</p>
                  <p className="mt-1 text-xs uppercase text-[var(--color-muted)]">
                    {t("sidebar.role", { role: user?.role })}
                  </p>
                </div>
                <Button className="w-full" icon={LogOut} variant="secondary" onClick={handleLogout}>
                  {t("sidebar.logout")}
                </Button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default MobileNav;
