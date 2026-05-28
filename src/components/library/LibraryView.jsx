import React, { useState } from "react";
import { Plus, Trash2, Pin, PinOff, Sparkles, Search } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Card from "../common/Card";
import { OCCASIONS, ICONS } from "../../constants/dhikrData";

export const LibraryView = () => {
  const {
    dhikrs,
    setDhikrs,
    lists,
    setLists,
    pinned,
    setPinned,
    setModal,
    dById,
    togglePin,
    startList,
    startDhikr,
    settings,
    searchQuery,
    setSearchQuery,
    activeOccasion,
    setActiveOccasion
  } = useApp();

  // Dynamic search & occasion tagging filtering
  const filteredLists = lists.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.note && l.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesOccasion = activeOccasion === "all" || l.occasion === activeOccasion;
    return matchesSearch && matchesOccasion;
  });

  const filteredDhikrs = dhikrs.filter((d) => {
    const matchesSearch = d.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.arabic.includes(searchQuery) ||
      (d.ur && d.ur.includes(searchQuery));
    const matchesOccasion = activeOccasion === "all" || (d.tags && d.tags.includes(activeOccasion));
    return matchesSearch && matchesOccasion;
  });

  return (
    <div className="space-y-6 anim-fade">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <h1 className="font-display text-2xl text-[var(--text)]">Library</h1>
        <div className="flex gap-1.5 sm:gap-2.5">
          <button 
            onClick={() => setModal("dhikr")} 
            className="rounded-2xl border border-[var(--line)] px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[var(--text)] font-semibold cursor-pointer hover:bg-[var(--surface2)] active:scale-[0.96] transition-all duration-300 shrink-0"
          >
            + Dhikr
          </button>
          <button 
            onClick={() => setModal("list")} 
            className="rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white cursor-pointer active:scale-[0.96] hover:brightness-105 transition-all duration-300 shrink-0 shadow-sm" 
            style={{ background: "var(--primary)" }}
          >
            + List
          </button>
        </div>
      </header>

      {/* Solid Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transliterations, translations, Arabic..."
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] pl-11 pr-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] placeholder:text-zinc-500/70 transition-all font-semibold"
        />
      </div>

      {/* Occasion Filter Pill Carousel */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
        <button
          onClick={() => setActiveOccasion("all")}
          className="rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap border cursor-pointer shrink-0 transition-all duration-200"
          style={activeOccasion === "all" ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" } : { borderColor: "var(--line)", color: "var(--muted)", background: "var(--surface)" }}
        >
          All
        </button>
        {Object.entries(OCCASIONS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActiveOccasion(k)}
            className="rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap border cursor-pointer shrink-0 transition-all duration-200"
            style={activeOccasion === k ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" } : { borderColor: "var(--line)", color: "var(--muted)", background: "var(--surface)" }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Tasbeeh & Sets Section */}
      <section>
        <h2 className="mb-3 font-display text-lg text-[var(--text)]">Tasbeeh & sets</h2>
        {filteredLists.length === 0 ? (
          <p className="text-center text-xs text-[var(--muted)] py-4 font-semibold">No tasbeeh sets match your parameters.</p>
        ) : (
          <div className="space-y-3">
            {filteredLists.map((l) => {
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
        )}
      </section>

      {/* All Dhikr Section */}
      <section>
        <h2 className="mb-3 font-display text-lg text-[var(--text)]">All dhikr</h2>
        {filteredDhikrs.length === 0 ? (
          <p className="text-center text-xs text-[var(--muted)] py-4 font-semibold">No dhikrs match your parameters.</p>
        ) : (
          <div className="space-y-3">
            {filteredDhikrs.map((d) => (
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
        )}
      </section>
    </div>
  );
};

export default LibraryView;
