import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";

export const NewListModal = ({ isOpen, onClose }) => {
  const { dhikrs, dById, saveList } = useApp();
  
  const [nl, setNl] = useState({ name: "", occasion: "custom", icon: "sparkles", steps: [] });
  const [pick, setPick] = useState({ dhikr: "", target: 33 });

  if (!isOpen) return null;

  const addStep = () => {
    if (!pick.dhikr) return;
    setNl((l) => ({
      ...l,
      steps: [...l.steps, { dhikr: pick.dhikr, target: Number(pick.target) || 33 }]
    }));
  };

  const handleSave = () => {
    saveList(nl, setNl);
    onClose();
  };

  const inputCls = "w-full rounded-xl border border-[var(--line)] bg-[var(--bg2)] px-3 py-2.5 text-[var(--text)] outline-none focus:border-[var(--primary)]";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" 
      onClick={onClose}
    >
      <div 
        className="anim-pop max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:rounded-3xl no-scrollbar" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-[var(--text)]">New list</h2>
          <button onClick={onClose} className="text-[var(--muted)] cursor-pointer">
            <X />
          </button>
        </div>

        <div className="space-y-3">
          <input 
            className={inputCls} 
            placeholder="List name (e.g. Before sleep)" 
            value={nl.name} 
            onChange={(e) => setNl({ ...nl, name: e.target.value })} 
          />
          
          <select 
            className={inputCls} 
            value={nl.occasion} 
            onChange={(e) => setNl({ ...nl, occasion: e.target.value })}
          >
            {Object.entries(OCCASIONS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          
          <select 
            className={inputCls} 
            value={nl.icon} 
            onChange={(e) => setNl({ ...nl, icon: e.target.value })}
          >
            {Object.keys(ICONS).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <div className="rounded-xl border border-[var(--line)] p-3">
            <p className="mb-2 text-sm text-[var(--muted)] font-medium">Steps</p>
            {nl.steps.length === 0 && (
              <p className="mb-2 text-xs text-[var(--muted)]">
                No steps yet — add some below.
              </p>
            )}
            {nl.steps.map((s, idx) => (
              <div 
                key={idx} 
                className="mb-1 flex items-center justify-between rounded-lg bg-[var(--bg2)] px-3 py-2 text-sm"
              >
                <span className="text-[var(--text)]">
                  {dById(s.dhikr)?.tr} ×{s.target}
                </span>
                <button 
                  onClick={() => setNl((l) => ({ ...l, steps: l.steps.filter((_, x) => x !== idx) }))} 
                  className="text-[var(--danger)] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            <div className="mt-2 flex gap-2">
              <select 
                className={`${inputCls} flex-1`} 
                value={pick.dhikr} 
                onChange={(e) => setPick({ ...pick, dhikr: e.target.value })}
              >
                <option value="">Choose dhikr…</option>
                {dhikrs.map((d) => (
                  <option key={d.id} value={d.id}>{d.tr}</option>
                ))}
              </select>
              <input 
                type="number" 
                className={`${inputCls} w-20`} 
                value={pick.target} 
                onChange={(e) => setPick({ ...pick, target: e.target.value })} 
              />
              <button 
                onClick={addStep} 
                className="rounded-xl px-3 text-white cursor-pointer active:scale-95 transition-all" 
                style={{ background: "var(--primary-dim)" }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleSave} 
            className="w-full rounded-xl py-3 font-medium text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all" 
            style={{ background: "var(--primary)" }}
          >
            Save list
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewListModal;
