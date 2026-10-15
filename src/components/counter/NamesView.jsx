import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useDrag } from "@use-gesture/react";
import { Navigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, LayoutGrid, Play, RotateCcw, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { SEED_NAMES_OF_ALLAH } from "../../constants/asmaUlHusna";
import { Button, IconButton } from "../common/Button";
import { Seg } from "../common/Seg";
import { Sheet } from "../common/Modal";
import { StarRosette, StarNumber } from "../common/Ornament";

const LAST = SEED_NAMES_OF_ALLAH.length - 1;
const GAP = 14;
const SNAP = { type: "spring", stiffness: 320, damping: 36, mass: 0.9 };

// Scale and fade a card by its distance from the centre of the deck.
const useCardMotion = (x, o, stepRef) => {
  const d = useTransform(x, (v) => Math.min(1, Math.abs((v + o * stepRef.current) / stepRef.current)));
  return { scale: useTransform(d, (t) => 1 - t * 0.07), opacity: useTransform(d, (t) => 1 - t * 0.5) };
};

// One Name as an illuminated card. `lang` picks the meaning shown.
const NameCard = ({ name, index, lang, large }) => {
  const meaning = lang === "ur" ? name.ur || name.en : name.en;
  return (
    <article className="h-full rounded-[1.375rem] border border-line bg-surface p-1.5 shadow-(--shadow-raise)">
      <div className="relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--gold)_38%,var(--line))] px-5 pb-7 pt-5 text-center">
        <StarRosette className="pointer-events-none absolute left-1/2 top-[44%] h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.13]" />
        <StarNumber n={index + 1} className="relative" />
        <div className="relative flex flex-1 flex-col items-center justify-center py-4">
          <p dir="rtl" lang="ar" className={`font-arabic leading-[1.6] text-ink ${large ? "text-[6rem]" : "text-[4.75rem]"}`}>
            {name.arabic}
          </p>
          <h2 className="mt-1 font-display text-[2rem] leading-tight text-ink">{name.tr}</h2>
          {meaning && (
            <p dir={lang === "ur" && name.ur ? "rtl" : undefined} className={`mx-auto mt-2 max-w-[26ch] text-base leading-relaxed text-muted ${lang === "ur" && name.ur ? "font-urdu" : ""}`}>
              {meaning}
            </p>
          )}
          {lang === "both" && name.ur && (
            <p dir="rtl" lang="ur" className="mt-1 font-urdu text-lg text-muted">
              {name.ur}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

/* The 99 Names as a deck of cards. The current Name sits centred with its
   neighbours peeking in; drag, swipe, tap a neighbour, or use the arrows. */
export const NamesView = () => {
  const { view, setView, namesSession, settings, navigateNames, startNamesSession, startDhikr, dById, vibe } = useApp();
  const isDesktop = useIsDesktop();

  const idx = namesSession.index;
  const name = SEED_NAMES_OF_ALLAH[idx];
  const [overview, setOverview] = useState(false);
  const [reading, setReading] = useState(false);
  const [tab, setTab] = useState("virtue");
  const railRef = useRef(null);

  // Card width follows the deck width so neighbours always peek.
  const deckRef = useRef(null);
  const [deckW, setDeckW] = useState(360);
  useLayoutEffect(() => {
    if (!deckRef.current) return;
    const ro = new ResizeObserver(([e]) => setDeckW(e.contentRect.width));
    ro.observe(deckRef.current);
    return () => ro.disconnect();
  }, []);
  const cardW = Math.min(deckW * 0.78, isDesktop ? 460 : 380);
  const step = cardW + GAP;
  const stepRef = useRef(step);
  useLayoutEffect(() => {
    stepRef.current = step;
  }, [step]);

  const x = useMotionValue(0);
  const busy = useRef(false);

  // Slide the deck one card, then commit the new index in the same frame
  // the track resets, so the swap is invisible.
  const slide = (dir) => {
    if (busy.current) return;
    if ((dir === 1 && idx >= LAST) || (dir === -1 && idx <= 0)) {
      animate(x, 0, SNAP);
      return;
    }
    busy.current = true;
    animate(x, -dir * step, SNAP).then(() => {
      flushSync(() => navigateNames(dir));
      x.set(0);
      busy.current = false;
    });
  };

  const jumpTo = (target) => {
    if (target !== idx) {
      startNamesSession(target);
      vibe(8);
    }
    x.set(0);
    setOverview(false);
  };

  const bind = useDrag(
    ({ down, movement: [mx], velocity: [vx], tap, last }) => {
      if (tap || busy.current) return;
      const atEdge = (mx > 0 && idx === 0) || (mx < 0 && idx === LAST);
      if (down) {
        x.set(atEdge ? mx * 0.25 : mx);
        return;
      }
      if (last) {
        const commit = !atEdge && (Math.abs(mx) > step * 0.22 || (vx > 0.35 && Math.abs(mx) > 24));
        if (commit) slide(mx < 0 ? 1 : -1);
        else animate(x, 0, SNAP);
      }
    },
    { axis: "x", filterTaps: true, pointer: { touch: true } }
  );

  const sPrev = useCardMotion(x, -1, stepRef);
  const sCur = useCardMotion(x, 0, stepRef);
  const sNext = useCardMotion(x, 1, stepRef);

  useEffect(() => {
    if (view !== "names") return;
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || document.querySelector('[role="dialog"]')) return;
      if (e.key === "ArrowLeft") slide(-1);
      else if (e.key === "ArrowRight") slide(1);
      else if (e.key === "Home") jumpTo(0);
      else if (e.key === "Escape") setView("home");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, idx, step]);

  useEffect(() => {
    railRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest" });
  }, [idx]);

  if (!name) return <Navigate to="/" replace />;

  const hasVirtue = !!(name.hadith || name.benefits);
  const hasStory = !!name.story;
  const readTabs = [...(hasVirtue ? [{ v: "virtue", l: "Virtue" }] : []), ...(hasStory ? [{ v: "story", l: "Background" }] : [])];
  const excerpt = name.benefits || name.story;
  const countable = dById(name.id) || name;
  const pct = ((idx + 1) / SEED_NAMES_OF_ALLAH.length) * 100;

  const cards = [
    { o: -1, i: idx - 1, s: sPrev },
    { o: 0, i: idx, s: sCur },
    { o: 1, i: idx + 1, s: sNext },
  ].filter((c) => c.i >= 0 && c.i <= LAST);

  return (
    <div className="flex min-h-[calc(100svh-1.5rem)] flex-col lg:min-h-[calc(100svh-3rem)]">
      <h1 className="sr-only">99 Names of Allah (Asma ul Husna) with meaning and transliteration</h1>

      <header className="flex items-center gap-2">
        <IconButton icon={X} label="Close" onClick={() => setView("home")} className="-ml-2" />
        <p className="flex-1 text-center font-display text-lg text-ink">The 99 Names</p>
        <IconButton icon={LayoutGrid} label="All 99 Names" onClick={() => setOverview(true)} className="-mr-2 lg:invisible" />
      </header>

      <div className="flex min-h-0 flex-1 lg:mt-4 lg:gap-10">
        <nav aria-label="All 99 Names" className="hidden w-60 shrink-0 lg:flex lg:flex-col">
          <ol ref={railRef} className="max-h-[calc(100svh-7rem)] space-y-0.5 overflow-y-auto pr-2">
            {SEED_NAMES_OF_ALLAH.map((n, i) => {
              const on = i === idx;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={on ? "true" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${on ? "bg-sunken" : "hover:bg-sunken"}`}
                  >
                    <span className="numerals w-6 text-right text-[0.8125rem] text-muted">{i + 1}</span>
                    <span className={`min-w-0 flex-1 truncate text-sm text-ink ${on ? "font-semibold" : ""}`}>{n.tr}</span>
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
          {/* Position */}
          <div className="mt-3 flex items-center gap-3 lg:mt-0">
            <span className="numerals shrink-0 text-sm text-muted">
              <span className="font-semibold text-ink">{idx + 1}</span> of 99
            </span>
            <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <span className="block h-full rounded-full bg-gold transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </span>
            <Button variant="link" size="sm" icon={RotateCcw} onClick={() => jumpTo(0)} disabled={idx === 0} className="-mr-2">
              Start from 1
            </Button>
          </div>

          {/* Deck */}
          <div className="flex flex-1 flex-col justify-center py-5">
            <div
              ref={deckRef}
              {...bind()}
              className="relative -mx-4 h-[min(31rem,60svh)] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing lg:mx-0 lg:h-[min(34rem,64svh)]"
              role="group"
              aria-roledescription="carousel"
              aria-label={`Name ${idx + 1} of 99, ${name.tr}`}
            >
              <motion.div className="absolute inset-y-0 left-1/2" style={{ x }}>
                {cards.map(({ o, i, s }) => (
                  <motion.div
                    key={SEED_NAMES_OF_ALLAH[i].id}
                    className="absolute inset-y-0"
                    style={{ width: cardW, left: o * step - cardW / 2, scale: s.scale, opacity: s.opacity }}
                    onClick={o !== 0 ? () => slide(o) : undefined}
                    aria-hidden={o !== 0}
                  >
                    <NameCard name={SEED_NAMES_OF_ALLAH[i]} index={i} lang={settings.lang} large={isDesktop} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Reflection */}
            {excerpt && (
              <div className="mx-auto mt-5 w-full max-w-[34rem] text-center">
                <p className="line-clamp-2 text-[0.9375rem] leading-relaxed text-muted lg:line-clamp-3">{excerpt}</p>
                {readTabs.length > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    iconRight={ArrowRight}
                    onClick={() => {
                      setTab(readTabs[0].v);
                      setReading(true);
                    }}
                    className="mt-1"
                  >
                    {hasVirtue ? "Hadith and virtue" : "Background"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2 pb-1">
            <IconButton icon={ChevronLeft} label="Previous Name" onClick={() => slide(-1)} disabled={idx === 0} className="border border-line-strong" />
            <Button variant="secondary" icon={Play} onClick={() => startDhikr(countable)} className="min-w-0 flex-1 sm:flex-none">
              <span className="truncate">Count this Name</span>
            </Button>
            <IconButton icon={ChevronRight} label="Next Name" onClick={() => slide(1)} disabled={idx === LAST} className="border border-line-strong" />
          </div>
        </div>
      </div>

      <Sheet open={reading} onClose={() => setReading(false)} title={name.tr} description={name.en} size="lg">
        {readTabs.length > 1 && <Seg label="About this Name" value={tab} onChange={setTab} options={readTabs} className="mb-6" />}
        {tab === "virtue" ? (
          <div className="space-y-6">
            {name.hadith && (
              <blockquote className="border-l-2 border-line-strong pl-5">
                <p className="font-display text-lg leading-relaxed text-ink">{name.hadith}</p>
              </blockquote>
            )}
            {name.benefits && <p className="max-w-[65ch] text-base leading-relaxed text-ink">{name.benefits}</p>}
          </div>
        ) : (
          <p className="max-w-[65ch] text-base leading-relaxed text-ink">{name.story}</p>
        )}
      </Sheet>

      <Sheet open={overview} onClose={() => setOverview(false)} title="All 99 Names" size="lg">
        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => jumpTo(0)} className="mb-4">
          Start from 1
        </Button>
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
