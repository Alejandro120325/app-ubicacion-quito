import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground = ({ children, className = "" }) => (
  <div
    className={`relative isolate overflow-hidden bg-slate-950 text-white ${className}`}
  >
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#0f1f3a,#123b6d_45%,#0f766e)]" />
    <div className="absolute inset-0 -z-10 animate-grid-pan opacity-35 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:36px_36px]" />
    <motion.div
      className="absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl"
      animate={{ x: [0, 28, 0], y: [0, -24, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -right-28 bottom-0 -z-10 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl"
      animate={{ x: [0, -24, 0], y: [0, 20, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    />
    {children}
  </div>
);

export default AnimatedBackground;
