import React from "react";

export const Seg = ({ options, value, onChange }) => (
  <div className="flex rounded-2xl border border-[var(--line)] bg-[var(--bg2)] p-1">
    {options.map((o) => (
      <button 
        key={o.v} 
        onClick={() => onChange(o.v)}
        className="flex-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-all cursor-pointer"
        style={value === o.v ? { background: "var(--primary)", color: "#fff" } : { color: "var(--muted)" }}
      >
        {o.l}
      </button>
    ))}
  </div>
);

export default Seg;
