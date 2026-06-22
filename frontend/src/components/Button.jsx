import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-soft hover:bg-[var(--color-primary-dark)]",
  secondary:
    "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-soft)]",
  dark: "bg-slate-950 text-white shadow-soft hover:bg-slate-800",
  success:
    "bg-[var(--color-secondary)] text-white shadow-soft hover:bg-[var(--color-primary-dark)]",
  danger: "bg-rose-500 text-white shadow-soft hover:bg-rose-600",
  ghost: "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-soft)] hover:text-[var(--color-text)]"
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3 text-base"
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white focus-ring";

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
