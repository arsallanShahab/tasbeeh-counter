import React, { useState } from "react";
import { X, Plus, Sparkles, FolderHeart, LayoutGrid, Check } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";
import Card from "../common/Card";

export const NewListModal = ({ isOpen, onClose }) => {
  const { dhikrs, dById, saveList, vibe } = useApp();
  
  const [nl, setNl] = useState({ name: "", occasion: "general", icon: "sparkles", steps: [] });
  const [pick, setPick] = useState({ dhikr: "", target: 33 });

  if (!isOpen) return null;

  const addStep = () => {
    if (!pick.dhikr) return;
    setNl((l) => ({
      ...l,
      steps: [...l.steps, { dhikr: pick.dhikr, target: Number(pick.target) || 33 }]
    }));
    setPick({ dhikr: "", target: 33 });
    vibe(5);
  };

  const handleSave = () => {
    if (!nl.name.trim() || nl.steps.length === 0) return;
    saveList(nl, setNl);
    onClose();
  };

  const isListValid = nl.name.trim() && nl.steps.length > 0;

  const handleQuickTarget = (v) => {
    setPick(prev => ({ ...prev, target: v }));
    vibe(5);
  };

  const inputCls = "w-full rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] placeholder:text-zinc-500/70 transition-all font-semibold";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all duration-300" 
      onClick={onClose}
    >
      <div 
        className="anim-pop max-h-[85vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 no-scrollbar shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--text)]">New Set List</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Create a multi-step custom tasbeeh set</p>
          </div>
          <button 
            onClick={onClose} 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--line)] transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Section 1: General Info */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <FolderHeart size={14} /> Basic Details
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--muted)] pl-1">Set Name (required)</label>
              <input 
                className={inputCls} 
                placeholder="e.g. Morning Adhkar, Before Sleep" 
                value={nl.name} 
                onChange={(e) => setNl({ ...nl, name: e.target.value })} 
              />
            </div>
          </div>

          {/* Section 2: Occasion Pill Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--muted)] pl-1">Occasion / Category</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {Object.entries(OCCASIONS).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setNl({ ...nl, occasion: k }); vibe(5); }}
                  className="rounded-full px-4.5 py-2 text-xs font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0"
                  style={nl.occasion === k ? { background: "linear-gradient(135deg, var(--primary), var(--primary-dim))", color: "#fff", borderColor: "var(--primary)" } : { borderColor: "var(--line)", color: "var(--muted)", background: "var(--bg2)" }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Visual Icon Selector Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--muted)] pl-1">Choose Widget Icon</label>
            <div className="grid grid-cols-7 gap-2">
              {Object.entries(ICONS).map(([k, IconComponent]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setNl({ ...nl, icon: k }); vibe(5); }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border transition-all cursor-pointer relative"
                  style={nl.icon === k ? { background: "var(--primary-dim)", borderColor: "var(--gold)" } : { borderColor: "var(--line)", background: "var(--bg2)" }}
                >
                  <IconComponent size={20} className={nl.icon === k ? "text-[var(--gold)] animate-pulse" : "text-[var(--muted)]"} />
                  {nl.icon === k && (
                    <div className="absolute -top-1 -right-1 bg-[var(--gold)] text-black rounded-full p-0.5 shadow-sm">
                      <Check size={8} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Steps builder */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--bg2)] p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
              <LayoutGrid size={14} /> Steps Timeline ({nl.steps.length})
            </p>

            {nl.steps.length === 0 ? (
              <p className="text-center text-xs text-[var(--muted)] py-2 font-medium">
                No steps added yet. Add a dhikr below to start your timeline.
              </p>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                {nl.steps.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm anim-fade"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface2)] text-[10px] font-bold text-[var(--gold)] shrink-0">
                        {idx + 1}
                      </span>
                      <p className="truncate font-semibold text-[var(--text)]">{dById(s.dhikr)?.tr}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="rounded-full bg-[var(--primary-dim)] px-2.5 py-0.5 text-xs font-bold text-[var(--primary)]">
                        ×{s.target}
                      </span>
                      <button 
                        onClick={() => setNl((l) => ({ ...l, steps: l.steps.filter((_, x) => x !== idx) }))} 
                        className="text-[var(--danger)] hover:scale-115 transition-all cursor-pointer p-0.5"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step Adder Widget */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Add a Dhikr Step</p>
              
              <div className="flex flex-col gap-2">
                <select 
                  className={inputCls} 
                  value={pick.dhikr} 
                  onChange={(e) => setPick({ ...pick, dhikr: e.target.value })}
                >
                  <option value="">Select dhikr…</option>
                  {dhikrs.map((d) => (
                    <option key={d.id} value={d.id}>{d.tr}</option>
                  ))}
                </select>

                <div className="flex gap-2">
                  {[33, 100, 300].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleQuickTarget(v)}
                      className="flex-1 rounded-xl border py-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95 duration-200"
                      style={Number(pick.target) === v ? { background: "var(--primary-dim)", color: "var(--primary)", borderColor: "var(--primary)" } : { borderColor: "var(--line)", color: "var(--muted)", background: "var(--bg2)" }}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="number" 
                    inputMode="numeric"
                    placeholder="Count…"
                    className="w-24 rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-3 py-2 text-center text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--primary)]" 
                    value={pick.target} 
                    onChange={(e) => setPick({ ...pick, target: e.target.value })} 
                  />
                  <button 
                    onClick={addStep} 
                    disabled={!pick.dhikr}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-[var(--primary-dim)] border border-[var(--primary)]/30 text-xs font-bold text-[var(--primary)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-white transition-all duration-300 py-2.5" 
                  >
                    <Plus size={16} /> Add Step
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Save Button */}
          <button 
            onClick={handleSave} 
            disabled={!isListValid}
            className="w-full rounded-2xl py-4 font-semibold text-white cursor-pointer active:scale-[0.96] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 mt-2 shadow-sm" 
            style={{ background: "var(--primary)" }}
          >
            {isListValid ? "Save & Create Set List" : "Name list & add steps"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewListModal;
