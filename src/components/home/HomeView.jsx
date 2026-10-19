import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Flame,
  Sparkles,
  Plus,
  Star,
  Moon,
  Sun,
  Mountain,
  ExternalLink,
  Share2,
  Info,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { fmt, computeStreak, dateKey } from "../../utils/stats";
import HomeIntro from "./HomeIntro";
import AdhkarChecklist from "./AdhkarChecklist";
import YourDhikr from "./YourDhikr";
import Explore from "./Explore";
import DuaSection from "../duas/DuaSection";
import DuaSheet from "../duas/DuaSheet";
import WeekReflection from "../stats/WeekReflection";
import ShareSheet from "../common/ShareSheet";
import { Sheet } from "../common/Modal";
import { resolveHomeSections } from "../../utils/homeSections";
import { useNow } from "../../hooks/useNow";
import { useOccasions } from "../../hooks/useOccasions";
import PrayerTimesCard from "../prayer/PrayerTimesCard";
import { Panel, ProgressBar } from "../common/Layout";
import { shelfOfOccasion } from "../../constants/shelves";
import { Button, IconButton } from "../common/Button";
import { SEED_NAMES_OF_ALLAH } from "../../constants/dhikrData";

/* Which set fits this hour. Ids must exist in SEED_LISTS. */
const suggestionFor = (hr) => {
  if (hr >= 4 && hr < 12)
    return { id: "morning-short", when: "For this morning" };
  if (hr >= 12 && hr < 16)
    return { id: "after-salah", when: "After your salah" };
  if (hr >= 16 && hr < 21)
    return { id: "evening-short", when: "For this evening" };
  return { id: "before-sleep", when: "Before you sleep" };
};

const OCC_ICONS = { star: Star, moon: Moon, sun: Sun, sparkles: Sparkles, mountain: Mountain };

const setTotal = (l) =>
  l.steps.reduce((acc, s) => acc + (Number(s.target) || 0), 0);

/* Roughly a second and a bit per count, rounded to whole minutes. */
const durationLabel = (count) => {
  const min = Math.max(1, Math.round((count * 1.3) / 60));
  return `about ${min} min`;
};

const dayOfYear = (d) => {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
};

export const HomeView = () => {
  const {
    setView,
    lists,
    stats,
    startList,
    setSearchQuery,
    session,
    complete,
    settings,
    dById,
    startNamesSession,
    setModal,
    setSettings,
  } = useApp();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const now = useNow(60000);
  const d = new Date(now);

  const goal = settings.dailyGoal || 100;
  const today = stats.byDate[dateKey()] || 0;
  const streak = computeStreak(stats.byDate);

  // A seasonal set leads when the Hijri date calls for one; others follow it.
  const occasions = useOccasions();
  const [occ, ...alsoOcc] = occasions;
  const [duaOpen, setDuaOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [sharingName, setSharingName] = useState(null); // "card" | "wallpaper"
  const nameIdx = dayOfYear(d) % SEED_NAMES_OF_ALLAH.length;
  const nameCard = useMemo(() => {
    const n = SEED_NAMES_OF_ALLAH[nameIdx];
    return n && { eyebrow: `Name of the day · ${nameIdx + 1} of 99`, arabic: n.arabic, title: n.tr, meaning: n.en, source: "", filename: `${n.tr.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png` };
  }, [nameIdx]);

  const sug = suggestionFor(d.getHours());
  const suggest = lists.find((l) => l.id === sug.id) || lists[0];

  const resumable = session && !complete && session.counts.some((c) => c > 0);

  // "Other sets" opens the shelf and occasion the lead belongs to.
  const openLibrary = (occasion) => {
    setSearchQuery("");
    const shelf = occasion && shelfOfOccasion(occasion);
    navigate(shelf ? `/library?shelf=${shelf}&sub=${encodeURIComponent(occasion)}` : "/library");
  };

  /* ── Lead: the one thing to do now. A session in progress wins over the
        time-of-day suggestion. ─────────────────────────────────────────── */
  const renderLead = () => {
    if (resumable) {
      const i = session.stepIndex;
      const done = session.counts.reduce((a, c) => a + c, 0);
      const total = session.steps.reduce((a, s) => a + s.target, 0);
      const step = session.steps[i];
      const stepDhikr = step ? dById(step.dhikr) : null;
      return (
        <Panel
          key="lead"
          as="section"
          aria-labelledby="lead-h"
          className="p-5 lg:p-8"
        >
          <p className="eyebrow">Continue where you left off</p>
          <h2
            id="lead-h"
            className="mt-2 font-display text-[1.75rem] leading-tight font-medium text-ink lg:text-[2.5rem]"
          >
            {session.title}
          </h2>
          <p className="numerals mt-1 truncate text-sm text-muted">
            {session.steps.length > 1
              ? `Step ${i + 1} of ${session.steps.length}`
              : "Single dhikr"}
            {stepDhikr ? ` · ${stepDhikr.tr}` : ""} · {fmt(done)} of{" "}
            {fmt(total)}
          </p>
          <ProgressBar
            value={done}
            max={total}
            label="Session progress"
            className="mt-4"
          />
          <Button
            icon={Play}
            onClick={() => setView("counter")}
            className="mt-4 w-full sm:w-auto"
          >
            Continue
          </Button>
        </Panel>
      );
    }
    if (occ) return renderOccasion();
    if (!suggest) return null;
    const total = setTotal(suggest);
    return (
      <Panel
        key="lead"
        as="section"
        aria-labelledby="lead-h"
        className="p-5 lg:p-8"
      >
        <p className="eyebrow">{sug.when}</p>
        <h2
          id="lead-h"
          className="mt-2 font-display text-[1.75rem] leading-tight font-medium text-ink lg:text-[2.5rem]"
        >
          {suggest.name}
        </h2>
        <p className="numerals mt-1 text-sm text-muted">
          {suggest.steps.length}{" "}
          {suggest.steps.length === 1 ? "dhikr" : "dhikrs"} · {fmt(total)}{" "}
          counts · {durationLabel(total)}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            icon={Play}
            onClick={() => startList(suggest)}
            className="flex-1 sm:flex-none"
          >
            Begin
          </Button>
          <Button
            variant="tonal"
            onClick={() => openLibrary(suggest.occasion)}
          >
            Other sets
          </Button>
        </div>
      </Panel>
    );
  };

  const renderOccasion = () => {
    const set = occ.set;
    const total = setTotal(set);
    const Icon = OCC_ICONS[occ.icon] || Sparkles;
    return (
      <Panel key="lead" as="section" aria-labelledby="lead-h" className="p-5 lg:p-8">
        <div className="-mt-2 -mr-2 flex items-center gap-2">
          <p className="eyebrow flex min-w-0 flex-1 items-center gap-2 text-gold">
            <Icon size={14} strokeWidth={2} className="shrink-0" aria-hidden="true" />
            <span>{occ.label}</span>
          </p>
          {occ.desc && <IconButton icon={Info} label={`Why now: ${occ.label}`} size="sm" onClick={() => setWhyOpen(true)} />}
        </div>
        <h2 id="lead-h" className="mt-1 font-display text-[1.75rem] leading-tight font-medium text-ink lg:text-[2.5rem]">
          {set.name}
        </h2>
        <p className="numerals mt-1 text-sm text-muted">
          {set.steps.length} {set.steps.length === 1 ? "dhikr" : "dhikrs"} · {fmt(total)} {total === 1 ? "count" : "counts"}
          {total >= 20 && ` · ${durationLabel(total)}`}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button icon={Play} onClick={() => startList(set)} className="flex-1 sm:flex-none">
            Begin
          </Button>
          {occ.duas ? (
            <Button variant="tonal" onClick={() => setDuaOpen(true)}>
              Your du'a list
            </Button>
          ) : occ.link ? (
            <a href={occ.link.href} target="_blank" rel="noopener noreferrer" className="btn btn-tonal btn-md">
              {occ.link.label}
              <ExternalLink size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Button variant="tonal" onClick={() => openLibrary(occ.browse)}>
              Other sets
            </Button>
          )}
        </div>
        {alsoOcc.length > 0 && (
          <div className="mt-4 border-t border-line pt-2">
            <p className="eyebrow pb-1 pt-2">Also today</p>
            {alsoOcc.map((o) => {
              const AlsoIcon = OCC_ICONS[o.icon] || Sparkles;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => startList(o.set)}
                  aria-label={`Begin ${o.set.name}, ${o.label}`}
                  className="row-interactive -mx-3 flex min-h-12 w-[calc(100%+1.5rem)] items-center gap-3 rounded-xl px-3 py-2 text-left"
                >
                  <AlsoIcon size={16} strokeWidth={1.75} className="shrink-0 text-gold" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-medium text-ink">{o.label}</span>
                    <span className="block truncate text-sm text-muted">{o.set.name}</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        )}
        <Sheet open={whyOpen} onClose={() => setWhyOpen(false)} title={occ.label} size="sm">
          <p className="text-[0.9375rem] leading-relaxed text-ink">{occ.desc}</p>
          <Button
            icon={Play}
            className="mt-5 w-full"
            onClick={() => {
              setWhyOpen(false);
              startList(set);
            }}
          >
            Begin {set.name}
          </Button>
        </Sheet>
      </Panel>
    );
  };

  /* ── Daily progress: one line of figures, no card ───────────────────── */
  const renderProgress = () => (
    <section key="streak" aria-label="Daily progress" className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="numerals text-[0.9375rem] text-muted">
          <span className="font-display text-2xl text-ink">{fmt(today)}</span> of {fmt(goal)} today
        </p>
        <p className="numerals flex items-center gap-1 text-sm text-muted">
          {streak > 0 && <Flame size={14} className="text-gold" aria-hidden="true" />}
          {streak} {streak === 1 ? "day" : "days"} · {fmt(stats.total)} all time
        </p>
      </div>
      <ProgressBar value={today} max={goal} label="Today's goal" tone={today >= goal ? "gold" : "accent"} />
      {today >= goal && <p className="text-sm text-muted">Today&rsquo;s goal is complete. Alhamdulillah.</p>}
    </section>
  );

  /* A Name of Allah for the day, set large. Gives the page a quiet end. */
  const renderName = () => {
    const idx = dayOfYear(d) % SEED_NAMES_OF_ALLAH.length;
    const name = SEED_NAMES_OF_ALLAH[idx];
    if (!name) return null;
    return (
      <section
        key="asmaul_husna"
        aria-labelledby="name-h"
        className="rounded-2xl border border-line bg-surface p-1.5"
      >
        {/* Inner rule: a manuscript-style double border. */}
        <div className="relative overflow-hidden rounded-[0.875rem] border border-[color-mix(in_srgb,var(--gold)_38%,var(--line))] px-5 pb-6 pt-6 text-center">
          <IconButton icon={Share2} label={`Share ${name.tr}`} size="sm" className="absolute right-1.5 top-1.5 z-10 text-muted" onClick={() => setSharingName("card")} />
          <div className="relative">
            <p className="eyebrow px-8 text-gold">Name of the day</p>
            <p
              dir="rtl"
              lang="ar"
              className="mt-4 font-arabic text-[3rem] leading-[1.45] text-ink"
            >
              {name.arabic}
            </p>
            <h2
              id="name-h"
              className="mt-1 font-display text-[1.5rem] leading-tight text-ink"
            >
              {name.tr}
            </h2>
            <p className="mx-auto mt-1.5 max-w-[30ch] text-[0.9375rem] leading-relaxed text-muted">
              {settings.lang === "ur" ? name.ur || name.en : name.en}
            </p>
            <Button variant="tonal" iconRight={ArrowRight} className="mt-5" onClick={() => startNamesSession(idx)}>
              Reflect on this Name
            </Button>
          </div>
        </div>
      </section>
    );
  };

  const renderPrayer = () =>
    settings?.prayer?.enabled && settings?.prayer?.showOnHome ? (
      <PrayerTimesCard key="prayer" />
    ) : null;

  const renderers = {
    suggested: () => null, // the lead below replaces the old suggested card
    prayer: renderPrayer,
    streak: renderProgress,
    yours: () => <YourDhikr key="yours" />,
    explore: () => <Explore key="explore" />,
    adhkar: () => <AdhkarChecklist key="adhkar" />,
    duas: () => <DuaSection key="duas" quietMoment={!!occ?.duas} />,
    // Fridays only, until put away for the week.
    reflection: () =>
      d.getDay() === 5 && settings.reflectionSeen !== dateKey(d) ? (
        <WeekReflection key="reflection" variant="today" onDismiss={() => setSettings((s) => ({ ...s, reflectionSeen: dateKey(d) }))} />
      ) : null,
    asmaul_husna: renderName,
  };

  const homeSections = resolveHomeSections(settings?.homeSections);
  const visible = homeSections.filter((s) => s.visible && renderers[s.key]);
  const showLead = resumable || visible.some((s) => s.key === "suggested");
  // The intro carries the occasion only when the lead card can't.
  const introOcc = !showLead || resumable ? occ : null;
  const render = (keys) =>
    visible.filter((s) => keys.includes(s.key)).map((s) => renderers[s.key]());

  const footer = (
    <footer className="space-y-6">
      <button
        type="button"
        onClick={() => setModal("list")}
        className="row-interactive flex min-h-16 w-full items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-3 text-left"
      >
        <Plus size={18} strokeWidth={1.75} className="shrink-0 text-accent" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.9375rem] font-medium text-ink">Create your own set</span>
          <span className="block text-sm leading-snug text-muted">Any dhikr, with your own counts.</span>
        </span>
        <span className="shrink-0 text-sm font-medium text-accent">Create</span>
      </button>
      <p className="border-t border-line pt-6 text-center text-sm text-muted">
        Your counts stay on this device. No account, no tracking.{" "}
        <button type="button" onClick={() => navigate("/privacy")} className="font-medium text-accent underline-offset-4 hover:underline">
          Privacy
        </button>
      </p>
    </footer>
  );

  const seoTitle = (
    <h1 className="sr-only">
      Free Online Tasbeeh Counter, Digital Dhikr &amp; Zikr Counter
    </h1>
  );

  if (isDesktop) {
    return (
      <div className="space-y-12">
        {seoTitle}
        <HomeIntro occasion={introOcc} />
        <div className="grid grid-cols-[minmax(0,1fr)_22rem] items-start gap-12">
          <div className="space-y-12">
            {showLead && renderLead()}
            {render(["reflection", "adhkar", "yours", "duas", "explore"])}
          </div>
          <aside className="sticky top-12 space-y-12">
            {render(["streak", "prayer", "asmaul_husna"])}
          </aside>
        </div>
        {footer}
        <DuaSheet open={duaOpen} onClose={() => setDuaOpen(false)} />
        <ShareSheet open={!!sharingName} onClose={() => setSharingName(null)} card={nameCard} initialFormat={sharingName || "card"} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {seoTitle}
      <HomeIntro occasion={introOcc} />
      {showLead && renderLead()}
      {visible.map((s) => renderers[s.key]())}
      {footer}
      <DuaSheet open={duaOpen} onClose={() => setDuaOpen(false)} />
      <ShareSheet open={!!sharingName} onClose={() => setSharingName(null)} card={nameCard} initialFormat={sharingName || "card"} />
    </div>
  );
};

export default HomeView;
