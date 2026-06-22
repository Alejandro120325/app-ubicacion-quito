import React from "react";
import LanguageSelector from "./LanguageSelector.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const AnimatedBackground = ({ children, className = "", showThemeToggle = false }) => (
  <div
    className={`relative isolate overflow-hidden bg-slate-950 text-white ${className}`}
  >
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#0f1f3a,#123b6d_46%,#0f766e)]" />
    <div className="absolute inset-0 -z-10 animate-grid-pan opacity-35 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:36px_36px]" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,.58))]" />
    {showThemeToggle ? (
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <LanguageSelector compact />
        <ThemeToggle compact />
      </div>
    ) : null}
    {children}
  </div>
);

export default AnimatedBackground;
