import React from "react";
import { Plus, Trash2, Pin, PinOff, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import NewDhikrModal from "./NewDhikrModal";
import NewListModal from "./NewListModal";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";

export const LibraryView = () => {
  const {
    dhikrs,
    setDhikrs,
    lists,
    setLists,
    pinned,
    setPinned,
    modal,
    setModal,
    dById,
    togglePin,
    startList,
    startDhikr,
    settings
  } = useApp();

  return (
    <div className="space-y-6 anim-fade">
      <header className="flex items-center justify-between pt-2">
        <h1 className="font-display text-2xl text-[var(--text)]">Library</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setModal("dhikr")} 
            className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--text)] cursor-pointer hover:bg-[var(--surface2)]"
          >
            + Dhikr
          </button>
          <button 
            onClick={() => setModal("list")} 
            className="rounded-xl px-3 py-1.5 text-sm font-medium text-white cursor-pointer active:scale-95 transition-all hover:brightness-110" 
            style={{ background: "var(--primary)" }}
          >
            + List
          </button>
        </div>
      </header>

      <section>
        <h2 className="mb-3 font-display text-lg text-[var(--text)]">Tasbeeh & sets</h2>
        <div className="space-y-3">
          {lists.map((l) => {
            const Ico = ICONS[l.icon] || Sparkles;
            return (
              <Card key={l.id} className="flex items-center gap-3 p-4">
                <div 
                  className="flex h-11 w-11 items-center justify-center rounded-2xl shrink-0" 
                  style={{ background: "var(--surface2)" }}
                >
                  <Ico size={20} className="text-[var(--gold)]" />
                </div>
                
                <button 
                  onClick={() => startList(l)} 
                  className="min-w-0 flex-1 text-left cursor-pointer"
                >
                  <p className="font-medium text-[var(--text)]">{l.name}</p>
                  <p className="truncate text-xs text-[var(--muted)]">
                    {l.steps.map((s) => `${dById(s.dhikr)?.tr ?? "?"} ×${s.target}`).join(" · ")}
                  </p>
                </button>
                
                <button 
                  onClick={() => togglePin(l.id)} 
                  className="p-2 text-[var(--muted)] cursor-pointer hover:text-[var(--gold)]"
                >
                  {pinned.includes(l.id) ? (
                    <Pin size={18} className="text-[var(--gold)]" />
                  ) : (
                    <PinOff size={18} />
                  )}
                </button>
                
                {l.id.startsWith("c_") && (
                  <button 
                    onClick={() => { 
                      setLists((ls) => ls.filter((x) => x.id !== l.id)); 
                      setPinned((p) => p.filter((x) => x !== l.id)); 
                    }} 
                    className="p-2 text-[var(--danger)] cursor-pointer hover:bg-[var(--surface2)] rounded-lg"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg text-[var(--text)]">All dhikr</h2>
        <div className="space-y-3">
          {dhikrs.map((d) => (
            <Card key={d.id} className="flex items-center gap-3 p-4">
              <button 
                onClick={() => startDhikr(d)} 
                className="min-w-0 flex-1 text-left cursor-pointer"
              >
                <p className="font-arabic text-xl text-[var(--text)]" dir="rtl">
                  {d.arabic}
                </p>
                <p className="text-xs text-[var(--gold)] font-medium mt-0.5">
                  {d.tr} · ×{d.target}
                </p>
                <p className="truncate text-xs text-[var(--muted)] mt-0.5">
                  {settings.lang === "ur" ? d.ur : d.en}
                </p>
              </button>
              
              <button 
                onClick={() => togglePin(d.id)} 
                className="p-2 text-[var(--muted)] cursor-pointer hover:text-[var(--gold)]"
              >
                {pinned.includes(d.id) ? (
                  <Pin size={18} className="text-[var(--gold)]" />
                ) : (
                  <PinOff size={18} />
                )}
              </button>
              
              {d.tags?.includes("custom") && (
                <button 
                  onClick={() => {
                    setDhikrs((ds) => ds.filter((x) => x.id !== d.id));
                    setPinned((p) => p.filter((x) => x !== d.id));
                  }} 
                  className="p-2 text-[var(--danger)] cursor-pointer hover:bg-[var(--surface2)] rounded-lg"
                >
                  <Trash2 size={17} />
                </button>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Render modular modals */}
      <NewDhikrModal 
        isOpen={modal === "dhikr"} 
        onClose={() => setModal(null)} 
      />
      <NewListModal 
        isOpen={modal === "list"} 
        onClose={() => setModal(null)} 
      />
    </div>
  );
};

export default LibraryView;
