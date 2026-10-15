import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, animate } from "motion/react";
import { useDrag } from "@use-gesture/react";
import { Navigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, LayoutGrid, Play } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SEED_NAMES_OF_ALLAH } from "../../constants/asmaUlHusna";
import { Button, IconButton } from "../common/Button";
import { Seg } from "../common/Seg";
import { Sheet } from "../common/Modal";

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 40 : dir < 0 ? -40 : 0, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ x: dir > 0 ? -40 : dir < 0 ? 40 : 0, opacity: 0, transition: { duration: 0.16 } }),
};

/* The 99 Names, one at a time: the Name set large in Arabic, its meaning,
   and its virtue and background when known. Swipe or use the arrow keys to
   move; the index (a rail on desktop, a grid sheet on phones) jumps anywhere. */
export const NamesView = () => {
  const { view, setView, namesSession, settings, navigateNames, startNamesSession, startDhikr, dById, vibe } = useApp();

  const [tab, setTab] = useState("meaning");
  const [direction, setDirection] = useState(0);
  const [overview, setOverview] = useState(false);
  const railRef = useRef(null);

  const idx = namesSession.index;
  const name = SEED_NAMES_OF_ALLAH[idx];
  const dragX = useMotionValue(0);

  const [forIdx, setForIdx] = useState(idx);
  if (forIdx !== idx) {
    setForIdx(idx);
    setTab("meaning");
  }

  const go = (dir) => {
    if ((dir === 1 && idx >= 98) || (dir === -1 && idx <= 0)) return;
    setDirection(dir);
    navigateNames(dir);
  };

  const jumpTo = (target) => {
    if (target !== idx) {
      setDirection(target > idx ? 1 : -1);
      startNamesSession(target);
      vibe(8);
    }
    setOverview(false);
  };

  const bindSwipe = useDrag(
    ({ down, movement: [mx], velocity: [vx], last, tap }) => {
      if (tap) return;
      if (down) {
        dragX.set(mx * 0.5);
        return;
      }
      if (last) {
        if (Math.abs(mx) > 55 || vx > 0.35) go(mx < 0 ? 1 : -1);
        animate(dragX, 0, { type: "spring", stiffness: 350, damping: 35 });
      }
    },
    { axis: "x", filterTaps: true, pointer: { touch: true } }
  );

  useEffect(() => {
    if (view !== "names") return;
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || document.querySelector('[role="dialog"]')) return;
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Escape") setView("home");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, idx]);

  // Keep the active Name visible in the desktop rail.
  useEffect(() => {
    railRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  if (!name) return <Navigate to="/" replace />;

  const meaning = settings.lang === "ur" ? name.ur || name.en : name.en;
  const tabs = [
    { v: "meaning", l: "Meaning" },
    ...(name.hadith || name.benefits ? [{ v: "virtue", l: "Virtue" }] : []),
    ...(name.story ? [{ v: "story", l: "Background" }] : []),
  ];
  const countable = dById(name.id) || name;

  const reading = (
    <div className="space-y-5">
      {tabs.length > 1 && <Seg label="About this Name" value={tab} onChange={setTab} options={tabs} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${name.id}-${tab}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-5"
        >
          {tab === "meaning" && (
            <>
              {(settings.lang === "en" || settings.lang === "both") && name.en && (
                <p className="font-display text-2xl leading-snug text-ink">{name.en}</p>
              )}
              {(settings.lang === "ur" || settings.lang === "both") && name.ur && (
                <p dir="rtl" lang="ur" className="font-urdu text-xl text-ink">
                  {name.ur}
                </p>
              )}
              {name.benefits && tabs.length === 1 && (
                <p className="max-w-[60ch] text-base leading-relaxed text-muted">{name.benefits}</p>
              )}
            </>
          )}
          {tab === "virtue" && (
            <>
              {name.hadith && (
                <blockquote className="border-l-2 border-line-strong pl-5">
                  <p className="font-display text-lg leading-relaxed text-ink">{name.hadith}</p>
                </blockquote>
              )}
              {name.benefits && <p className="max-w-[60ch] text-base leading-relaxed text-ink">{name.benefits}</p>}
            </>
          )}
          {tab === "story" && <p className="max-w-[60ch] text-base leading-relaxed text-ink">{name.story}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100svh-1.5rem)] flex-col lg:min-h-[calc(100svh-3rem)]">
      <h1 className="sr-only">99 Names of Allah (Asma ul Husna) with meaning and transliteration</h1>

      <header className="flex items-center gap-2">
        <IconButton icon={X} label="Close" onClick={() => setView("home")} className="-ml-2" />
        <p className="flex-1 text-center font-display text-lg text-ink">The 99 Names</p>
        <IconButton icon={LayoutGrid} label="All 99 Names" onClick={() => setOverview(true)} className="-mr-2 lg:invisible" />
      </header>

      <div className="flex min-h-0 flex-1 lg:mt-6 lg:gap-10">
        {/* Desktop index */}
        <nav aria-label="All 99 Names" className="hidden w-60 shrink-0 lg:flex lg:flex-col">
          <ol ref={railRef} className="max-h-[calc(100svh-8rem)] space-y-0.5 overflow-y-auto pr-2">
            {SEED_NAMES_OF_ALLAH.map((n, i) => {
              const on = i === idx;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={on ? "true" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      on ? "bg-sunken" : "hover:bg-sunken"
                    }`}
                  >
                    <span className="numerals w-6 text-right text-[0.8125rem] text-muted">{i + 1}</span>
                    <span className={`min-w-0 flex-1 truncate text-sm ${on ? "font-semibold text-ink" : "text-ink"}`}>{n.tr}</span>
                    <span dir="rtl" lang="ar" className="font-arabic text-base text-muted">
                      {n.arabic}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.article
              key={name.id}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <motion.div
                {...bindSwipe()}
                style={{ x: dragX, touchAction: "pan-y" }}
                className="flex cursor-grab select-none flex-col items-center py-8 text-center active:cursor-grabbing lg:py-0"
              >
                <p className="eyebrow numerals">
                  Name {idx + 1} of 99
                </p>
                <p dir="rtl" lang="ar" className="mt-4 font-arabic text-[5rem] leading-[1.45] text-ink lg:text-[7rem]">
                  {name.arabic}
                </p>
                <h2 className="mt-1 font-display text-[2rem] leading-tight text-ink">{name.tr}</h2>
                {meaning && <p className="mt-1 text-[0.9375rem] text-muted lg:hidden">{meaning}</p>}
              </motion.div>

              <div className="border-t border-line pt-6 lg:border-0 lg:pt-0">{reading}</div>
            </motion.article>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-2 pb-1">
            <IconButton icon={ChevronLeft} label="Previous Name" onClick={() => go(-1)} disabled={idx === 0} className="border border-line-strong" />
            <Button variant="ghost" icon={Play} onClick={() => startDhikr(countable)} className="min-w-0 px-3">
              <span className="truncate">Count this Name</span>
            </Button>
            <IconButton icon={ChevronRight} label="Next Name" onClick={() => go(1)} disabled={idx === 98} className="border border-line-strong" />
          </div>
        </div>
      </div>

      <Sheet open={overview} onClose={() => setOverview(false)} title="All 99 Names" size="lg">
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {SEED_NAMES_OF_ALLAH.map((n, i) => {
            const on = i === idx;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={on ? "true" : undefined}
                  aria-label={`${i + 1}. ${n.tr}`}
                  className={`flex w-full flex-col items-center gap-0.5 rounded-xl border px-1 py-3 transition-colors ${
                    on ? "border-ink bg-ink text-page" : "border-line text-ink hover:border-line-strong"
                  }`}
                >
                  <span className={`numerals text-xs ${on ? "" : "text-muted"}`}>{i + 1}</span>
                  <span dir="rtl" lang="ar" className="font-arabic text-xl leading-snug">
                    {n.arabic}
                  </span>
                  <span className="w-full truncate px-1 text-center text-xs">{n.tr}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </Sheet>
    </div>
  );
};

export default NamesView;
