import React from "react";

export const Card = ({ children, className = "", ...props }) => (
  <div 
    className={`rounded-3xl border bg-[var(--surface)] border-[var(--line)] ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export default Card;
