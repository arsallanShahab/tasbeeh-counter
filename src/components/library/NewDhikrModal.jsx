import React, { useState } from "react";
import { X, Type, Languages, Target } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Modal from "../common/Modal";

export const NewDhikrModal = ({ isOpen, onClose }) => {
  const { saveDhikr, vibe } = useApp();
  const [nd, setNd] = useState({ tr: "", arabic: "", en: "", ur: "", target: 33 });

  const handleSave = () => {
    if (!nd.tr.trim() || !nd.arabic.trim()) return;
    saveDhikr(nd, setNd);
    onClose();
  };

  const isValid = nd.tr.trim() && nd.arabic.trim();

  const handleQuickTarget = (v) => {
    setNd(prev => ({ ...prev, target: v }));
    vibe(8);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--text)]">New Dhikr</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Create a custom single tasbeeh prayer</p>
          </div>
          <button 
            onClick={onClose} 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--line)] transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Section 1: Calligraphy */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <Type size={14} /> Calligraphy & Transliteration
            </p>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--muted)] pl-1">Arabic Text (required)</label>
              <input 
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-4 py-4 text-center font-arabic text-3xl text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:font-sans placeholder:text-base placeholder:text-zinc-500/70 transition-all font-semibold"
                dir="rtl" 
                placeholder="سُبْحَانَ ٱللَّٰهِ" 
                value={nd.arabic} 
                onChange={(e) => setNd({ ...nd, arabic: e.target.value })} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--muted)] pl-1">Pronunciation / Translit (required)</label>
              <input 
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-4 py-3 text-[var(--text)] text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 placeholder:text-zinc-500/70 transition-all font-semibold" 
                placeholder="e.g. SubhanAllah" 
                value={nd.tr} 
                onChange={(e) => setNd({ ...nd, tr: e.target.value })} 
              />
            </div>
          </div>

          {/* Section 2: Meanings */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <Languages size={14} /> Translations
            </p>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--muted)] pl-1">English Meaning</label>
              <input 
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-4 py-3 text-[var(--text)] text-sm outline-none focus:border-[var(--primary)] placeholder:text-zinc-500/70 transition-all font-medium" 
                placeholder="Glory be to Allah" 
                value={nd.en} 
                onChange={(e) => setNd({ ...nd, en: e.target.value })} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--muted)] pl-1">Urdu Meaning</label>
              <input 
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-4 py-3 text-right font-urdu text-[var(--text)] text-base outline-none focus:border-[var(--primary)] placeholder:font-sans placeholder:text-sm placeholder:text-zinc-500/70 transition-all font-semibold" 
                dir="rtl" 
                placeholder="اللہ پاک ہے" 
                value={nd.ur} 
                onChange={(e) => setNd({ ...nd, ur: e.target.value })} 
              />
            </div>
          </div>

          {/* Section 3: Target Count */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
              <Target size={14} /> Default Target
            </p>
            
            <div className="flex gap-2">
              {[33, 100, 300, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickTarget(val)}
                  className="flex-1 rounded-xl border py-2 text-xs font-bold transition-all cursor-pointer active:scale-95 duration-200"
                  style={Number(nd.target) === val ? { background: "linear-gradient(135deg, var(--primary), var(--primary-dim))", color: "#fff", borderColor: "var(--primary)" } : { borderColor: "var(--line)", color: "var(--muted)", background: "var(--bg2)" }}
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="number" 
                inputMode="numeric"
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-4 py-3 text-center text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--primary)] transition-all" 
                placeholder="Custom target count…"
                value={nd.target} 
                onChange={(e) => setNd({ ...nd, target: e.target.value })} 
              />
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave} 
            disabled={!isValid}
            className="w-full rounded-2xl py-4 font-semibold text-white cursor-pointer active:scale-[0.96] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 mt-2 shadow-sm" 
            style={{ background: "var(--primary)" }}
          >
            {isValid ? "Save & Add Dhikr" : "Fill Required Fields"}
          </button>
        </div>
      </Modal>
  );
};

export default NewDhikrModal;
