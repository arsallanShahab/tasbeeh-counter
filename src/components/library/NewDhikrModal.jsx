import React, { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";

export const NewDhikrModal = ({ isOpen, onClose }) => {
  const { saveDhikr } = useApp();
  const [nd, setNd] = useState({ tr: "", arabic: "", en: "", ur: "", target: 33 });

  if (!isOpen) return null;

  const handleSave = () => {
    saveDhikr(nd, setNd);
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
          <h2 className="font-display text-xl text-[var(--text)]">New dhikr</h2>
          <button onClick={onClose} className="text-[var(--muted)] cursor-pointer">
            <X />
          </button>
        </div>

        <div className="space-y-3">
          <input 
            className={inputCls} 
            placeholder="Transliteration (e.g. SubhanAllah)" 
            value={nd.tr} 
            onChange={(e) => setNd({ ...nd, tr: e.target.value })} 
          />
          <input 
            className={`${inputCls} font-arabic text-right text-xl`} 
            dir="rtl" 
            placeholder="العربية" 
            value={nd.arabic} 
            onChange={(e) => setNd({ ...nd, arabic: e.target.value })} 
          />
          <input 
            className={inputCls} 
            placeholder="English translation" 
            value={nd.en} 
            onChange={(e) => setNd({ ...nd, en: e.target.value })} 
          />
          <input 
            className={`${inputCls} font-urdu text-right`} 
            dir="rtl" 
            placeholder="اردو ترجمہ" 
            value={nd.ur} 
            onChange={(e) => setNd({ ...nd, ur: e.target.value })} 
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--muted)] shrink-0">Default count</span>
            <input 
              type="number" 
              className={inputCls} 
              value={nd.target} 
              onChange={(e) => setNd({ ...nd, target: e.target.value })} 
            />
          </div>
          <button 
            onClick={handleSave} 
            className="w-full rounded-xl py-3 font-medium text-white cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all" 
            style={{ background: "var(--primary)" }}
          >
            Save dhikr
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDhikrModal;
