import React, { useEffect } from "react";
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Undo2, RotateCcw, 
  Pencil, Sparkles, Check, X 
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { resolveBeadTheme } from "../../utils/theme";
import BeadRing from "./BeadRing";
import Card from "../common/Card";

export const TransBlock = ({ d, translit, lang }) => {
  if (!d) return null;
  return (
    <div className="text-center">
      <p className="font-arabic text-4xl leading-relaxed text-[var(--text)]" dir="rtl">
        {d.arabic}
      </p>
      {translit && (
        <p className="mt-2 text-base font-medium text-[var(--gold)]">
          {d.tr}
        </p>
      )}
      {(lang === "en" || lang === "both") && (
        <p className="mt-1 text-sm text-[var(--muted)]">
          {d.en}
        </p>
      )}
      {(lang === "ur" || lang === "both") && (
        <p className="font-urdu mt-1 text-base text-[var(--muted)]" dir="rtl">
          {d.ur}
        </p>
      )}
    </div>
  );
};

export const CounterView = () => {
  const {
    view,
    setView,
    session,
    setSession,
    settings,
    bump,
    complete,
    setComplete,
    targetEdit,
    setTargetEdit,
    customT,
    setCustomT,
    dById,
    increment,
    decrement,
    resetSession,
    goStep,
    applyTarget,
    vibe
  } = useApp();

  /* Keyboard shortcut controls (desktop) */
  useEffect(() => {
    if (view !== "counter") return;
    
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      
      if ([" ", "Enter", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        increment();
      } else if (e.key === "Backspace" || e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      } else if (e.key === "ArrowLeft") {
        goStep(-1);
      } else if (e.key === "ArrowRight") {
        goStep(1);
      } else if (e.key.toLowerCase() === "r") {
        resetSession();
      } else if (e.key === "Escape") {
        setView("home");
      }
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, session, settings, increment, decrement, goStep, resetSession, setView]);

  if (!session) {
    setView("home");
    return null;
  }

  // Redirect home safely if the step index goes out of bounds during rapid navigation
  useEffect(() => {
    if (session && !session.steps[session.stepIndex]) {
      setView("home");
    }
  }, [session, setView]);

  const i = session.stepIndex;
  const step = session.steps[i];
  if (!step) return null;

  const d = dById(step.dhikr);
  const count = session.counts[i];
  const target = step.target;
  const loops = session.loops[i];
  const p = Math.min(count / target, 1);
  const C = 2 * Math.PI * 86;
  const done = count >= target;

  /* Touch Swiping Handlers for full screen/ring view */
  let down = null;
  const onDown = (e) => {
    down = { x: e.clientX, y: e.clientY, t: Date.now() };
  };
  const onUp = (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    const dt = Date.now() - down.t;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      goStep(dx < 0 ? 1 : -1);
    } else if (Math.abs(dx) < 16 && Math.abs(dy) < 16 && dt < 600) {
      increment();
    }
    down = null;
  };

  const beads = settings.counterStyle !== "ring";
  const bt = resolveBeadTheme(settings);
  const numColor = beads ? bt.arc : "var(--primary)";
  
  const centerContent = (
    <>
      <span 
        className={`font-display text-7xl leading-none tap-num ${bump ? "bump" : ""}`} 
        style={{ color: numColor }}
      >
        {String(count).padStart(2, "0")}
      </span>
      <button
        onPointerDown={(e) => e.stopPropagation()} 
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => { 
          e.stopPropagation(); 
          setCustomT(""); 
          setTargetEdit(true); 
        }}
        className="pointer-events-auto mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-base font-medium text-[var(--muted)] active:bg-[var(--surface2)] cursor-pointer"
      >
        / {target} <Pencil size={14} />
      </button>
      {loops > 0 && (
        <span className="mt-2 rounded-full bg-[var(--surface2)] px-3 py-0.5 text-xs text-[var(--gold)]">
          round {loops + 1}
        </span>
      )}
      {done && <Check size={20} className="mt-2 text-[var(--gold)]" />}
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col anim-fade">
      <header className="flex items-center justify-between pt-2">
        <button 
          onClick={() => setView("home")} 
          className="flex items-center gap-1 text-sm text-[var(--muted)] cursor-pointer"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <p className="font-display text-[var(--text)]">{session.title}</p>
        <div className="w-12" />
      </header>

      {session.steps.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {session.steps.map((s, idx) => (
            <button 
              key={idx} 
              onClick={() => { 
                setSession((cur) => ({ ...cur, stepIndex: idx })); 
                setComplete(false); 
                vibe(6);
              }}
              className="rounded-full px-3 py-1 text-xs transition-all cursor-pointer"
              style={idx === i ? { background: "var(--primary)", color: "#fff" } : { background: "var(--surface2)", color: "var(--muted)" }}
            >
              {idx + 1}/{session.steps.length}
            </button>
          ))}
        </div>
      )}

      <div className="mt-16 md:mt-8 px-2">
        <TransBlock d={d} translit={settings.translit} lang={settings.lang} />
      </div>

      <div className="flex flex-1 items-end justify-center pb-8 md:items-center md:pb-0">
        {beads ? (
          <BeadRing 
            count={count} 
            target={target} 
            theme={bt} 
            activeStyle={settings.activeStyle} 
            onInc={increment} 
            onDec={decrement}
          >
            {centerContent}
          </BeadRing>
        ) : (
          <div 
            onPointerDown={onDown} 
            onPointerUp={onUp}
            className="relative flex h-[300px] w-[300px] cursor-pointer select-none items-center justify-center"
            style={{ touchAction: "none" }}
          >
            <svg 
              viewBox="0 0 200 200" 
              className="h-full w-full -rotate-90" 
              style={done ? { animation: "ringPulse .6s ease" } : {}}
            >
              <circle cx="100" cy="100" r="86" fill="none" stroke="var(--surface2)" strokeWidth="10" />
              <circle 
                cx="100" 
                cy="100" 
                r="86" 
                fill="none" 
                stroke={done ? "var(--gold)" : "var(--primary)"} 
                strokeWidth="10"
                strokeLinecap="round" 
                strokeDasharray={C} 
                strokeDashoffset={C * (1 - p)} 
                style={{ transition: "stroke-dashoffset .35s cubic-bezier(.2,.7,.3,1), stroke .3s" }} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>

      <p className="mb-2 text-center text-xs text-[var(--muted)] px-4 leading-relaxed">
        {beads 
          ? "Tap to count · drag the beads — clockwise to count up, counter-clockwise to go back" 
          : "Tap to count · swipe ← → to change dhikr · ⌫ to undo"
        }
      </p>
      
      <div className="mb-2 flex items-center justify-center gap-3">
        <button 
          onClick={() => goStep(-1)} 
          disabled={i === 0} 
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] text-[var(--text)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={decrement} 
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] text-[var(--text)] cursor-pointer"
        >
          <Undo2 size={20} />
        </button>
        <button 
          onClick={resetSession} 
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] text-[var(--danger)] cursor-pointer"
        >
          <RotateCcw size={20} />
        </button>
        <button 
          onClick={() => goStep(1)} 
          disabled={i === session.steps.length - 1} 
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] text-[var(--text)] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>
      </div>

      {complete && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-6" 
          onClick={() => setComplete(false)}
        >
          <Card 
            className="anim-pop w-full max-w-xs p-6 text-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <Sparkles className="mx-auto text-[var(--gold)]" size={32} />
            <p className="font-display mt-3 text-xl text-[var(--text)]">Completed</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {session.title} — may it be accepted.
            </p>
            <div className="mt-5 flex gap-3">
              <button 
                onClick={() => { 
                  resetSession(); 
                  setComplete(false); 
                }} 
                className="flex-1 rounded-2xl py-3 text-sm font-semibold text-white cursor-pointer active:scale-[0.96] transition-all duration-300 shadow-sm" 
                style={{ background: "var(--primary)" }}
              >
                Again
              </button>
              <button 
                onClick={() => { 
                  setComplete(false); 
                  setView("home"); 
                }} 
                className="flex-1 rounded-2xl border border-[var(--line)] py-3 text-sm font-semibold text-[var(--text)] cursor-pointer hover:bg-[var(--surface2)] active:scale-[0.96] transition-all duration-300"
              >
                Done
              </button>
            </div>
          </Card>
        </div>
      )}

      {targetEdit && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" 
          onClick={() => setTargetEdit(false)}
        >
          <Card 
            className="anim-pop w-full max-w-md rounded-t-3xl p-5 sm:rounded-3xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-[var(--text)]">Set target</h2>
              <button onClick={() => setTargetEdit(false)} className="text-[var(--muted)] cursor-pointer">
                <X />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[33, 100, 300, 1000].map((v) => (
                <button 
                  key={v} 
                  onClick={() => applyTarget(v)} 
                  className="rounded-2xl border py-4 text-lg font-medium transition-all cursor-pointer"
                  style={target === v ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" } : { borderColor: "var(--line)", color: "var(--text)" }}
                >
                  {v}
                </button>
              ))}
            </div>
            
            <div className="mt-3 flex gap-2">
              <input 
                type="number" 
                inputMode="numeric" 
                value={customT} 
                onChange={(e) => setCustomT(e.target.value)} 
                placeholder="Custom amount…"
                className="flex-1 rounded-2xl border border-[var(--line)] bg-[var(--bg2)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]" 
              />
              <button 
                onClick={() => applyTarget(customT)} 
                disabled={!customT} 
                className="rounded-2xl px-6 font-semibold text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed active:scale-[0.96] transition-all duration-300 shadow-sm" 
                style={{ background: "var(--primary)" }}
              >
                Set
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-[var(--muted)]">
              Changes the target for the current dhikr.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CounterView;
