import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const MODE_KEY = "quito-ui-mode";
const COLOR_KEY = "quito-ui-color-theme";

export const colorThemes = [
  { id: "quito", labelKey: "theme.azulQuito", short: "Quito", color: "#1d4ed8" },
  {
    id: "turquoise",
    labelKey: "theme.turquesaSeguridad",
    short: "Safety",
    color: "#0891b2"
  },
  { id: "family", labelKey: "theme.verdeFamilia", short: "Family", color: "#16a34a" },
  { id: "night", labelKey: "theme.moradoNocturno", short: "Night", color: "#7c3aed" },
  { id: "alert", labelKey: "theme.naranjaAlerta", short: "Alert", color: "#f97316" },
  {
    id: "professional",
    labelKey: "theme.grisProfesional",
    short: "Pro",
    color: "#475569"
  }
];

const ThemeContext = createContext(null);

const getStoredValue = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => getStoredValue(MODE_KEY, "light"));
  const [colorTheme, setColorTheme] = useState(() =>
    getStoredValue(COLOR_KEY, "quito")
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.themeMode = mode;
    root.dataset.colorTheme = colorTheme;
    root.classList.toggle("dark", mode === "dark");
    localStorage.setItem(MODE_KEY, mode);
    localStorage.setItem(COLOR_KEY, colorTheme);
  }, [mode, colorTheme]);

  const value = useMemo(
    () => ({
      colorTheme,
      colorThemes,
      isDark: mode === "dark",
      mode,
      setColorTheme,
      setMode,
      toggleMode: () => setMode((current) => (current === "dark" ? "light" : "dark"))
    }),
    [colorTheme, mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }

  return context;
};
