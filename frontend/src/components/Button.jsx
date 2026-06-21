import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const variants = {
  primary: "bg-quito-blue text-white hover:bg-blue-700 shadow-soft",
  secondary:
    "border border-slate-200 bg-white text-slate-800 hover:border-sky-200 hover:bg-sky-50",
  dark: "bg-slate-950 text-white hover:bg-slate-800 shadow-soft",
  success: "bg-quito-mint text-white hover:bg-teal-600 shadow-soft",
  danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-soft",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3 text-base"
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white focus-ring";

const Button = ({
  children,
  className = "",
  icon: Icon,
  size = "md",
  to,
  type = "button",
  variant = "primary",
  ...props
}) => {
  const composedClass = `${baseClass} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
        <Link className={composedClass} to={to} {...props}>
          {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={composedClass}
      type={type}
      whileHover={{ y: props.disabled ? 0 : -2 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      {...props}
    >
      {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
      {children}
    </motion.button>
  );
};

export default Button;
