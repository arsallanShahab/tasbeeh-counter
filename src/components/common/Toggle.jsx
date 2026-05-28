import React from "react";

export const Toggle = ({ on, onClick }) => (
  <button 
    onClick={onClick} 
    aria-pressed={on}
    className="relative h-7 w-12 shrink-0 rounded-full transition-colors cursor-pointer"
    style={{ background: on ? "var(--primary)" : "var(--line)" }}
  >
    <span 
      className="absolute top-1 h-5 w-5 rounded-full bg-white transition-all" 
      style={{ left: on ? 26 : 4 }} 
    />
  </button>
);

export default Toggle;
