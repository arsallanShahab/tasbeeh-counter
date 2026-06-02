import React from "react";
import { motion } from "motion/react";

export const Card = ({ children, className = "", animated = false, ...props }) => {
  if (animated) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={`rounded-3xl border bg-[var(--surface)] border-[var(--line)] ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <div
      className={`rounded-3xl border bg-[var(--surface)] border-[var(--line)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
