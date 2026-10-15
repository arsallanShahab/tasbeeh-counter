import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Navigate } from "react-router-dom";
import {
  X, ChevronLeft, ChevronRight, Undo2, RotateCcw, Pencil, Check, Hand, BookOpen, Palette,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { resolveBeadTheme } from "../../utils/theme";
import { Sheet } from "../common/Modal";
import { Button, IconButton } from "../common/Button";
import { TextInput } from "../common/Field";
import BeadRing from "./BeadRing";
import BeadStrand from "./BeadStrand";
import TransBlock from "./TransBlock";
import DhikrReader from "./DhikrReader";
import CounterStylePicker from "./CounterStylePicker";
import { useToast } from "../common/toastContext";

const PRESETS = [33, 100, 300, 1000];

export const CounterView = () => {
  const {
    view, setView, session, setSession, settings, setSettings, complete, setComplete,
    targetEdit, setTargetEdit, customT, setCustomT, dById, increment, decrement, resetSession,
    goStep, applyTarget, vibe,
  } = useApp();

  const isDesktop = useIsDesktop();
  const [readerOpen, setReaderOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const toast = useToast();
  const tapStart = useRef(null);

  // Pulse the number on each count, locally, without re-rendering the app.
  const [numRef, animateNum] = useAnimate();
  const liveCount = session?.counts?.[session?.stepIndex] ?? 0;
  useEffect(() => {
    if (liveCount && numRef.current) animateNum(numRef.current, { scale: [1.06, 1] }, { duration: 0.22, ease: [0.22, 1, 0.36, 1] });
  }, [liveCount, animateNum, numRef]);

  // Close the reader when the dhikr changes underneath it.
  const stepIndex = session?.stepIndex;
  const [readerStep, setReaderStep] = useState(stepIndex);
  if (readerStep !== stepIndex) {
    setReaderStep(stepIndex);
    if (readerOpen) setReaderOpen(false);
  }

  useEffect(() => {
    if (view !== "counter") return;
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (document.querySelector('[role="dialog"]')) return;
      if ([" ", "Enter", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        increment();
      } else if (e.key === "Backspace" || e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      } else if (e.key === "ArrowLeft") goStep(-1);
      else if (e.key === "ArrowRight") goStep(1);
      else if (e.key.toLowerCase() === "r") resetSession();
      else if (e.key === "Escape") setView("home");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, increment, decrement, goStep, resetSession, setView]);

  const stepOutOfBounds = !!session && !session.steps[session.stepIndex];
  useEffect(() => {
    if (stepOutOfBounds) setView("home");
  }, [stepOutOfBounds, setView]);

  if (!session) return <Navigate to="/" replace />;

  const i = session.stepIndex;
  const step = session.steps[i];
  if (!step) return null;

  const d = dById(step.dhikr);
  const count = session.counts[i];
  const target = step.target;
  const loops = session.loops[i];
  const p = Math.min(count / target, 1);
  const done = count >= target;
  const multi = session.steps.length > 1;

  /* Full-screen tap: any tap on the page counts, except on controls marked
     [data-tap-skip]; a horizontal swipe moves between dhikr. */
  const isTapSkip = (el) => !!el?.closest?.("input, textarea, button, a, [data-tap-skip]");
  const onDown = (e) => {
    if (isTapSkip(e.target)) {
      tapStart.current = null;
      return;
    }
    tapStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };
  const onUp = (e) => {
    const start = tapStart.current;
    tapStart.current = null;
    if (!start || isTapSkip(e.target)) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dt = Date.now() - start.t;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goStep(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 16 && Math.abs(dy) < 16 && dt < 600) increment();
  };

  const style = settings.counterStyle === "ring" ? "ring" : settings.counterStyle === "strand" ? "strand" : "beads";
  const beads = style !== "ring";
  const bt = resolveBeadTheme(settings);
  const C = 2 * Math.PI * 88;
  const label = `Count ${d?.tr || "dhikr"}. ${count} of ${target}.`;

  const center = (
    <>
      <span
        ref={numRef}
        className="numerals inline-block font-display text-[4.5rem] leading-none text-ink lg:text-[5.5rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        {count}
      </span>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setCustomT("");
          setTargetEdit(true);
        }}
        data-tap-skip="true"
        aria-label={`Target ${target}. Change target`}
        className="numerals pointer-events-auto mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-base text-muted transition-colors hover:bg-sunken hover:text-ink"
      >
        of {target} <Pencil size={13} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {loops > 0 && (
          <motion.span
            key={`loop-${loops}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="numerals mt-2 text-[0.8125rem] font-medium text-gold"
          >
            {loops} completed
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {done && !loops && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="mt-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-on-gold"
            aria-hidden="true"
          >
            <Check size={16} strokeWidth={2.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const counter = style === "strand" ? (
    <BeadStrand key={d?.id} count={count} target={target} theme={bt} activeStyle={settings.activeStyle} onInc={increment} onDec={decrement} label={label}>
      {center}
    </BeadStrand>
  ) : beads ? (
    <BeadRing
      key={d?.id}
      count={count}
      target={target}
      theme={bt}
      activeStyle={settings.activeStyle}
      onInc={increment}
      onDec={decrement}
      label={label}
    >
      {center}
    </BeadRing>
  ) : (
    <motion.div
      onPointerDown={(e) => {
        tapStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
      }}
      onPointerUp={onUp}
      whileTap={{ scale: 0.985 }}
      data-tap-skip="true"
      role="button"
      aria-label={label}
      className="relative flex aspect-square w-[min(19rem,80vw,44svh)] cursor-pointer select-none items-center justify-center lg:w-[min(23rem,58svh)]"
      style={{ touchAction: "none" }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="100" cy="100" r="88" fill="none" stroke="var(--line)" strokeWidth="4" />
        <motion.circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke={done ? "var(--gold)" : "var(--primary)"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={C}
          animate={{ strokeDashoffset: C * (1 - p) }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </svg>
      <div className="pointer-events-none relative flex flex-col items-center">{center}</div>
    </motion.div>
  );

  const hint = settings.fullScreenTap
    ? "Tap anywhere on the screen to count. Swipe sideways to change dhikr."
    : isDesktop
    ? "Click the beads or press Space to count. Backspace undoes, arrows change dhikr, R resets."
    : style === "strand"
      ? "Tap to count, or pull the beads to the right. Pull left to undo."
      : beads
        ? "Tap to count, or slide the beads clockwise."
        : "Tap to count. Swipe sideways to change dhikr.";

  const toolbar = (
    <div data-tap-skip="true" className="flex items-center justify-center gap-1.5" role="toolbar" aria-label="Counter controls">
      {multi && (
        <IconButton icon={ChevronLeft} label="Previous dhikr" disabled={i === 0} onClick={() => goStep(-1)} />
      )}
      <IconButton icon={Undo2} label="Undo last count" disabled={count === 0} onClick={decrement} />
      <IconButton icon={RotateCcw} label="Start this session again" onClick={resetSession} />
      <IconButton
        icon={Hand}
        label={settings.fullScreenTap ? "Tap anywhere: on" : "Tap anywhere: off"}
        pressed={!!settings.fullScreenTap}
        onClick={() => {
          const on = !settings.fullScreenTap;
          setSettings((s) => ({ ...s, fullScreenTap: on }));
          toast(on ? "Tap anywhere on the screen to count" : "Tap the beads to count");
        }}
      />
      <IconButton icon={Palette} label="Counter style" onClick={() => setStyleOpen(true)} />
      {multi && (
        <IconButton
          icon={ChevronRight}
          label="Next dhikr"
          disabled={i === session.steps.length - 1}
          onClick={() => goStep(1)}
        />
      )}
    </div>
  );

  return (
    <div
      className="flex min-h-[calc(100svh-1.5rem)] flex-col lg:min-h-[calc(100svh-3rem)]"
      onPointerDown={settings.fullScreenTap ? onDown : undefined}
      onPointerUp={settings.fullScreenTap ? onUp : undefined}
      onPointerCancel={settings.fullScreenTap ? () => (tapStart.current = null) : undefined}
      style={{ touchAction: "manipulation" }}
    >
      <h1 className="sr-only">{session.title}</h1>

      {/* Top bar */}
      <header data-tap-skip="true" className="flex items-center gap-2">
        <IconButton icon={X} label="Close counter" onClick={() => setView("home")} className="-ml-2" />
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-display text-lg leading-tight text-ink">{session.title}</p>
          {multi && (
            <p className="numerals text-[0.8125rem] text-muted">
              {i + 1} of {session.steps.length}
            </p>
          )}
        </div>
        <IconButton icon={BookOpen} label="Read in full" onClick={() => setReaderOpen(true)} className="-mr-2" />
      </header>

      {/* Steps: one segment per dhikr, filling as it is counted. */}
      {multi && (
        <nav data-tap-skip="true" aria-label="Dhikr in this set" className="mt-4">
          <ol className="flex gap-1.5">
            {session.steps.map((s, idx) => {
              const sd = dById(s.dhikr);
              const pct = Math.min(1, (session.counts[idx] || 0) / s.target);
              const active = idx === i;
              return (
                <li key={idx} className="min-w-0 flex-1">
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    aria-label={`${idx + 1}. ${sd?.tr || "Dhikr"}, ${session.counts[idx] || 0} of ${s.target}`}
                    onClick={() => {
                      setSession((cur) => ({ ...cur, stepIndex: idx }));
                      setComplete(false);
                      vibe(6);
                    }}
                    className="group block w-full pt-2 text-left"
                  >
                    <span className="block h-1 overflow-hidden rounded-full bg-line">
                      <span
                        className={`block h-full rounded-full transition-[width] duration-300 ${pct >= 1 ? "bg-gold" : "bg-accent"}`}
                        style={{ width: `${pct * 100}%` }}
                      />
                    </span>
                    <span
                      className={`mt-1.5 hidden truncate text-[0.8125rem] sm:block ${
                        active ? "font-medium text-ink" : "text-muted group-hover:text-ink"
                      }`}
                    >
                      {sd?.tr}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Reading */}
        <div className="mt-6 flex min-w-0 flex-col justify-center lg:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={d?.id || i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {d ? (
                <TransBlock
                  d={d}
                  lang={settings.lang}
                  fieldOrder={settings.dhikrFieldOrder}
                  fieldVisible={settings.dhikrFieldVisible}
                  collapsedMax={isDesktop ? 440 : 200}
                  size={isDesktop ? "lg" : "md"}
                  onOpenReader={settings.fullScreenTap ? undefined : () => setReaderOpen(true)}
                />
              ) : (
                <p className="text-center text-[0.9375rem] text-muted">This dhikr is no longer in your library.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Counting */}
        <div className="flex flex-1 flex-col items-center justify-end gap-5 pb-2 pt-6 lg:justify-center lg:pt-0">
          <div className={`flex flex-1 justify-center lg:flex-none ${style === "strand" ? "items-stretch" : "items-center"}`}>{counter}</div>
          <p className="max-w-[36ch] text-center text-[0.8125rem] leading-relaxed text-muted">{hint}</p>
          {toolbar}
        </div>
      </div>

      {/* Completion */}
      <Sheet
        open={complete}
        onClose={() => setComplete(false)}
        size="sm"
        title="Completed"
        description={`${session.title}. May Allah accept it from you.`}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              block
              onClick={() => {
                resetSession();
                setComplete(false);
              }}
            >
              Recite again
            </Button>
            <Button
              block
              onClick={() => {
                setComplete(false);
                setView("home", { replace: true });
              }}
            >
              Done
            </Button>
          </div>
        }
      >
        <div className="flex items-center gap-4 rounded-2xl bg-sunken px-5 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-on-gold">
            <Check size={22} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <p className="numerals text-[0.9375rem] text-ink">
            {session.counts.reduce((a, c) => a + c, 0)} counts across {session.steps.length}{" "}
            {session.steps.length === 1 ? "dhikr" : "dhikr"}.
          </p>
        </div>
      </Sheet>

      {/* Target */}
      <Sheet
        open={targetEdit}
        onClose={() => setTargetEdit(false)}
        size="sm"
        title="Change target"
        description={`How many times to recite ${d?.tr || "this dhikr"} in this session.`}
      >
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Common targets">
          {PRESETS.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={target === v}
              onClick={() => applyTarget(v)}
              className={`numerals h-14 rounded-xl border text-lg font-medium transition-colors ${
                target === v ? "border-ink bg-ink text-page" : "border-line text-ink hover:border-line-strong"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (customT) applyTarget(customT);
          }}
        >
          <TextInput
            type="number"
            inputMode="numeric"
            min={1}
            value={customT}
            onChange={(e) => setCustomT(e.target.value)}
            placeholder="Another number"
            aria-label="Custom target"
            className="numerals"
          />
          <Button type="submit" disabled={!customT} className="h-12">
            Set
          </Button>
        </form>
        <p className="mt-3 text-[0.8125rem] text-muted">Applies to this session only. Edit the set to change it for good.</p>
      </Sheet>

      <Sheet open={styleOpen} onClose={() => setStyleOpen(false)} title="Counter style" description="Changes apply straight away.">
        <CounterStylePicker />
      </Sheet>

      <DhikrReader open={readerOpen} onClose={() => setReaderOpen(false)} d={d} lang={settings.lang} />
    </div>
  );
};

export default CounterView;
