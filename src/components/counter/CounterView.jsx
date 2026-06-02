import React, { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Undo2, RotateCcw,
  Pencil, Sparkles, Check, X
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { resolveBeadTheme } from "../../utils/theme";
import BeadRing from "./BeadRing";
import Card from "../common/Card";

const spring = { type: "spring", stiffness: 380, damping: 30 };
const softSpring = { type: "spring", stiffness: 220, damping: 26 };

export const TransBlock = ({ d, translit, lang }) => {
  if (!d) return null;
  return (
    <motion.div
      key={d.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={softSpring}
      className="text-center"
    >
      <p className="font-arabic text-4xl leading-relaxed text-[var(--text)]" dir="rtl">
        {d.arabic}
      </p>
      {translit && (
        <p className="mt-2 text-base font-medium text-[var(--gold)]">{d.tr}</p>
      )}
      {(lang === "en" || lang === "both") && (
        <p className="mt-1 text-sm text-[var(--muted)]">{d.en}</p>
      )}
      {(lang === "ur" || lang === "both") && (
        <p className="font-urdu mt-1 text-base text-[var(--muted)]" dir="rtl">{d.ur}</p>
      )}
    </motion.div>
  );
};

const SoftPill = ({ children, label, tone = "default", disabled, ...props }) => {
  const color = tone === "danger" ? "var(--danger)" : "var(--text)";
  const hoverBg =
    tone === "danger"
      ? "color-mix(in srgb, var(--danger) 14%, transparent)"
      : "color-mix(in srgb, var(--primary) 14%, transparent)";
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.04, backgroundColor: hoverBg }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      disabled={disabled}
      aria-label={label}
      className="flex items-center justify-center rounded-full px-4 py-2.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ color, background: "transparent" }}
      {...props}
    >
      {children}
    </motion.button>
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

  useEffect(() => {
    if (view !== "counter") return;
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if ([" ", "Enter", "ArrowUp"].includes(e.key)) { e.preventDefault(); increment(); }
      else if (e.key === "Backspace" || e.key === "ArrowDown") { e.preventDefault(); decrement(); }
      else if (e.key === "ArrowLeft") goStep(-1);
      else if (e.key === "ArrowRight") goStep(1);
      else if (e.key.toLowerCase() === "r") resetSession();
      else if (e.key === "Escape") setView("home");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, session, settings, increment, decrement, goStep, resetSession, setView]);

  if (!session) {
    setView("home");
    return null;
  }

  useEffect(() => {
    if (session && !session.steps[session.stepIndex]) setView("home");
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

  let down = null;
  const onDown = (e) => { down = { x: e.clientX, y: e.clientY, t: Date.now() }; };
  const onUp = (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    const dt = Date.now() - down.t;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goStep(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 16 && Math.abs(dy) < 16 && dt < 600) increment();
    down = null;
  };

  const beads = settings.counterStyle !== "ring";
  const bt = resolveBeadTheme(settings);
  const numColor = beads ? bt.arc : "var(--primary)";

  const centerContent = (
    <>
      <motion.span
        className="font-display text-7xl leading-none"
        style={{ color: numColor }}
        animate={{ scale: bump ? 1.16 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 18 }}
      >
        {String(count).padStart(2, "0")}
      </motion.span>
      <motion.button
        whileTap={{ scale: 0.94 }}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); setCustomT(""); setTargetEdit(true); }}
        className="pointer-events-auto mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-base font-medium text-[var(--muted)] active:bg-[var(--surface2)] cursor-pointer"
      >
        / {target} <Pencil size={14} />
      </motion.button>
      <AnimatePresence mode="wait">
        {loops > 0 && (
          <motion.span
            key={`loop-${loops}`}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={spring}
            className="mt-2 rounded-full bg-[var(--surface2)] px-3 py-0.5 text-xs text-[var(--gold)]"
          >
            round {loops + 1}
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            className="mt-2"
          >
            <Check size={20} className="text-[var(--gold)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Soft floating header pill */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="flex items-center justify-between rounded-full px-2 py-1.5 backdrop-blur-2xl"
        style={{
          background: "color-mix(in srgb, var(--surface) 70%, transparent)",
          border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
          boxShadow:
            "0 6px 24px -14px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
        }}
      >
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ x: -2 }}
          onClick={() => setView("home")}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer"
          style={{
            color: "var(--text)",
            background: "color-mix(in srgb, var(--surface2) 60%, transparent)",
          }}
        >
          <ArrowLeft size={15} /> Back
        </motion.button>
        <motion.p
          key={session.title}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-display text-sm text-[var(--text)] truncate px-2"
        >
          {session.title}
        </motion.p>
        <div className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: "color-mix(in srgb, var(--gold) 14%, transparent)" }}
        >
          <span className="text-[10px] font-bold" style={{ color: "var(--gold)" }}>
            {i + 1}/{session.steps.length}
          </span>
        </div>
      </motion.header>

      {session.steps.length > 1 && (
        <div className="mt-3 flex justify-center">
          <div
            className="flex gap-1 rounded-full p-1"
            style={{ background: "color-mix(in srgb, var(--surface2) 50%, transparent)" }}
          >
            {session.steps.map((s, idx) => {
              const active = idx === i;
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSession((cur) => ({ ...cur, stepIndex: idx }));
                    setComplete(false);
                    vibe(6);
                  }}
                  className="relative rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer"
                  style={{ color: active ? "var(--primary)" : "var(--muted)" }}
                >
                  {active && (
                    <motion.span
                      layoutId="step-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--surface) 95%, transparent)",
                        boxShadow:
                          "inset 0 1px 0 0 color-mix(in srgb, #fff 10%, transparent), 0 2px 8px -4px color-mix(in srgb, var(--primary) 40%, transparent)",
                      }}
                      transition={spring}
                    />
                  )}
                  <span className="relative">{idx + 1}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-16 md:mt-8 px-2">
        <AnimatePresence mode="wait">
          <TransBlock key={d?.id} d={d} translit={settings.translit} lang={settings.lang} />
        </AnimatePresence>
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
          <motion.div
            onPointerDown={onDown}
            onPointerUp={onUp}
            whileTap={{ scale: 0.985 }}
            transition={spring}
            className="relative flex h-[300px] w-[300px] cursor-pointer select-none items-center justify-center"
            style={{ touchAction: "none" }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(circle at center, var(--primary) 0%, transparent 60%)`, filter: "blur(8px)" }}
              animate={{ opacity: 0.12 + p * 0.35, scale: done ? 1.06 : 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <svg viewBox="0 0 200 200" className="relative h-full w-full -rotate-90">
              <circle cx="100" cy="100" r="86" fill="none" stroke="var(--surface2)" strokeWidth="10" />
              <motion.circle
                cx="100" cy="100" r="86"
                fill="none"
                stroke={done ? "var(--gold)" : "var(--primary)"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                animate={{ strokeDashoffset: C * (1 - p) }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              />
              <AnimatePresence>
                {done && (
                  <motion.circle
                    key="ring-sweep"
                    cx="100" cy="100" r="86"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="4"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.96, 1.18, 1.3] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ transformOrigin: "100px 100px" }}
                  />
                )}
              </AnimatePresence>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {centerContent}
            </div>
          </motion.div>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-3 text-center text-[11px] text-[var(--muted)] px-6 leading-relaxed"
      >
        {beads
          ? "Tap to count · drag the beads clockwise to count up"
          : "Tap to count · swipe ← → to change dhikr"
        }
      </motion.p>

      {/* Soft floating control bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...softSpring, delay: 0.1 }}
        className="mx-auto mb-2 flex items-center gap-1 rounded-full p-1.5 backdrop-blur-2xl"
        style={{
          background: "color-mix(in srgb, var(--surface) 70%, transparent)",
          border: "1px solid color-mix(in srgb, var(--line) 50%, transparent)",
          boxShadow:
            "0 6px 24px -14px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 0 color-mix(in srgb, #fff 8%, transparent)",
        }}
      >
        <SoftPill
          onClick={() => goStep(-1)}
          disabled={i === 0}
          label="Prev"
        >
          <ChevronLeft size={18} />
        </SoftPill>
        <SoftPill onClick={decrement} label="Undo">
          <Undo2 size={17} />
        </SoftPill>
        <div className="mx-0.5 h-6 w-px" style={{ background: "color-mix(in srgb, var(--line) 60%, transparent)" }} />
        <SoftPill onClick={resetSession} label="Reset" tone="danger">
          <RotateCcw size={17} />
        </SoftPill>
        <div className="mx-0.5 h-6 w-px" style={{ background: "color-mix(in srgb, var(--line) 60%, transparent)" }} />
        <SoftPill
          onClick={() => goStep(1)}
          disabled={i === session.steps.length - 1}
          label="Next"
        >
          <ChevronRight size={18} />
        </SoftPill>
      </motion.div>

      {/* Completion modal — sparkle burst + spring zoom */}
      <AnimatePresence>
        {complete && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-6"
            onClick={() => setComplete(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}
              className="relative w-full max-w-xs rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center shadow-2xl"
            >
              {/* Sparkle particle burst */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(8)].map((_, k) => {
                  const angle = (k / 8) * Math.PI * 2;
                  return (
                    <motion.div
                      key={k}
                      className="absolute left-1/2 top-12 h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--gold)" }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{
                        x: Math.cos(angle) * 70,
                        y: Math.sin(angle) * 70,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.4],
                      }}
                      transition={{ duration: 1.1, delay: 0.08, ease: "easeOut" }}
                    />
                  );
                })}
              </div>
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 360, damping: 14, delay: 0.05 }}
              >
                <Sparkles className="mx-auto text-[var(--gold)]" size={32} />
              </motion.div>
              <p className="font-display mt-3 text-xl text-[var(--text)]">Completed</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {session.title} — may it be accepted.
              </p>
              <div className="mt-5 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { resetSession(); setComplete(false); }}
                  className="flex-1 rounded-2xl py-3 text-sm font-semibold text-white cursor-pointer shadow-sm"
                  style={{ background: "var(--primary)" }}
                >
                  Again
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setComplete(false); setView("home"); }}
                  className="flex-1 rounded-2xl border border-[var(--line)] py-3 text-sm font-semibold text-[var(--text)] cursor-pointer hover:bg-[var(--surface2)]"
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target edit — bottom sheet slide up */}
      <AnimatePresence>
        {targetEdit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
            onClick={() => setTargetEdit(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%", opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.6 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="w-full max-w-md rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:rounded-3xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--text)]">Set target</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setTargetEdit(false)} className="text-[var(--muted)] cursor-pointer">
                  <X />
                </motion.button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[33, 100, 300, 1000].map((v) => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => applyTarget(v)}
                    className="relative rounded-2xl border py-4 text-lg font-medium cursor-pointer"
                    style={target === v ? { borderColor: "var(--primary)", color: "#fff" } : { borderColor: "var(--line)", color: "var(--text)" }}
                  >
                    {target === v && (
                      <motion.span
                        layoutId="target-pill"
                        className="absolute inset-0 rounded-2xl"
                        style={{ background: "var(--primary)" }}
                        transition={spring}
                      />
                    )}
                    <span className="relative">{v}</span>
                  </motion.button>
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
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => applyTarget(customT)}
                  disabled={!customT}
                  className="rounded-2xl px-6 font-semibold text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  style={{ background: "var(--primary)" }}
                >
                  Set
                </motion.button>
              </div>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">
                Changes the target for the current dhikr.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CounterView;
