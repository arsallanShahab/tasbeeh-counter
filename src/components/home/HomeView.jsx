import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Flame, Pin, Sparkles, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { fmt, computeStreak, dateKey } from "../../utils/stats";
import HomeIntro, { useNow } from "./HomeIntro";
import PrayerTimesCard from "../prayer/PrayerTimesCard";
import { Panel, SectionHeader, ListGroup, ListRow, IconTile, GlyphTile, ProgressBar } from "../common/Layout";
import { Button } from "../common/Button";
import {
  ICONS,
  OCCASIONS,
  DEFAULT_QUICK_COLLECTIONS,
  DEFAULT_HOME_SECTIONS,
  EMOTIONAL_REMEDIES,
  SEED_NAMES_OF_ALLAH,
} from "../../constants/dhikrData";

/* Which set fits this hour. Ids must exist in SEED_LISTS. */
const suggestionFor = (hr) => {
  if (hr >= 4 && hr < 12) return { id: "morning-short", when: "For this morning" };
  if (hr >= 12 && hr < 16) return { id: "after-salah", when: "After your salah" };
  if (hr >= 16 && hr < 21) return { id: "evening-short", when: "For this evening" };
  return { id: "before-sleep", when: "Before you sleep" };
};

const setTotal = (l) => l.steps.reduce((acc, s) => acc + (Number(s.target) || 0), 0);

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
  const { setView, lists, dhikrs, pinned, stats, startList, startDhikr, setSearchQuery, session, complete, settings, dById } =
    useApp();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const now = useNow(60000);
  const d = new Date(now);

  const goal = settings.dailyGoal || 100;
  const today = stats.byDate[dateKey()] || 0;
  const streak = computeStreak(stats.byDate);

  const pinnedItems = pinned
    .map((id) => {
      const list = lists.find((l) => l.id === id);
      if (list) return { type: "list", data: list };
      const dhikr = dhikrs.find((x) => x.id === id);
      if (dhikr) return { type: "dhikr", data: dhikr };
      return null;
    })
    .filter(Boolean);

  const sug = suggestionFor(d.getHours());
  const suggest = lists.find((l) => l.id === sug.id) || lists[0];

  const resumable = session && !complete && session.counts.some((c) => c > 0);

  const quickKeys =
    settings?.quickCollections && settings.quickCollections.length > 0 ? settings.quickCollections : DEFAULT_QUICK_COLLECTIONS;
  const quick = quickKeys.filter((k) => OCCASIONS[k]);

  const openLibrary = (occasion) => {
    setSearchQuery("");
    navigate(occasion ? `/library?occasion=${encodeURIComponent(occasion)}` : "/library");
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
        <Panel key="lead" as="section" aria-labelledby="lead-h" className="p-6 lg:p-8">
          <p className="eyebrow">Continue where you left off</p>
          <h2 id="lead-h" className="mt-3 font-display text-[2rem] leading-tight font-medium text-ink lg:text-[2.5rem]">
            {session.title}
          </h2>
          <p className="numerals mt-2 text-[0.9375rem] text-muted">
            {session.steps.length > 1 ? `Step ${i + 1} of ${session.steps.length}` : "Single dhikr"}
            {stepDhikr ? ` · ${stepDhikr.tr}` : ""} · {fmt(done)} of {fmt(total)}
          </p>
          <ProgressBar value={done} max={total} label="Session progress" className="mt-5" />
          <Button size="lg" icon={Play} onClick={() => setView("counter")} className="mt-6 w-full sm:w-auto">
            Continue
          </Button>
        </Panel>
      );
    }
    if (!suggest) return null;
    const first = dById(suggest.steps[0]?.dhikr);
    const total = setTotal(suggest);
    return (
      <Panel key="lead" as="section" aria-labelledby="lead-h" className="p-6 lg:p-8">
        <p className="eyebrow">{sug.when}</p>
        <h2 id="lead-h" className="mt-3 font-display text-[2rem] leading-tight font-medium text-ink lg:text-[2.5rem]">
          {suggest.name}
        </h2>
        <p className="numerals mt-2 text-[0.9375rem] text-muted">
          {suggest.steps.length} {suggest.steps.length === 1 ? "dhikr" : "dhikrs"} · {fmt(total)} counts · {durationLabel(total)}
        </p>
        {first && (
          <p dir="rtl" lang="ar" className="mt-6 truncate font-arabic text-[1.75rem] leading-[1.9] text-ink">
            {first.arabic}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="lg" icon={Play} onClick={() => startList(suggest)} className="flex-1 sm:flex-none">
            Begin
          </Button>
          <Button variant="ghost" size="lg" onClick={() => openLibrary(suggest.occasion)}>
            Other sets
          </Button>
        </div>
      </Panel>
    );
  };

  /* ── Daily progress: one line of figures, no card ───────────────────── */
  const renderProgress = () => (
    <section key="streak" aria-label="Daily progress" className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="numerals font-display text-[2.75rem] leading-none text-ink">{fmt(today)}</p>
          <p className="numerals mt-2 text-sm text-muted">of {fmt(goal)} today</p>
        </div>
        <dl className="flex gap-6 text-right">
          <div>
            <dt className="text-sm text-muted">Streak</dt>
            <dd className="numerals mt-1 flex items-center justify-end gap-1 font-display text-2xl leading-none text-ink">
              {streak > 0 && <Flame size={16} className="text-gold" aria-hidden="true" />}
              {streak}
              <span className="sr-only"> days</span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">All time</dt>
            <dd className="numerals mt-1 font-display text-2xl leading-none text-ink">{fmt(stats.total)}</dd>
          </div>
        </dl>
      </div>
      <ProgressBar value={today} max={goal} label="Today's goal" tone={today >= goal ? "gold" : "accent"} />
      {today >= goal && <p className="text-sm text-muted">Today&rsquo;s goal is complete. Alhamdulillah.</p>}
    </section>
  );

  const renderPinned = () => (
    <section key="pinned" aria-labelledby="pinned-h" className="space-y-4">
      <SectionHeader
        id="pinned-h"
        title="Your dhikr"
        action={
          <Button variant="link" size="sm" onClick={() => navigate("/library?tab=mine")}>
            Manage
          </Button>
        }
      />
      {pinnedItems.length === 0 ? (
        <Panel className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted">
            <Pin size={18} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="flex-1 text-[0.9375rem] leading-relaxed text-muted">
            Pin the sets you recite every day and they&rsquo;ll wait for you here.
          </p>
          <Button variant="secondary" size="sm" onClick={() => openLibrary()}>
            Browse library
          </Button>
        </Panel>
      ) : (
        <ListGroup>
          {pinnedItems.map(({ type, data }) => {
            const isList = type === "list";
            const Ico = isList ? ICONS[data.icon] || Sparkles : null;
            const count = isList ? setTotal(data) : data.target;
            return (
              <ListRow
                key={data.id}
                leading={isList ? <IconTile icon={Ico} /> : <GlyphTile char={data.arabic.charAt(0)} />}
                title={isList ? data.name : data.tr}
                subtitle={
                  isList
                    ? data.steps
                        .map((s) => dById(s.dhikr)?.tr)
                        .filter(Boolean)
                        .join(" · ") || "No dhikr yet"
                    : data.en
                }
                meta={`×${fmt(count)}`}
                onClick={() => (isList ? startList(data) : startDhikr(data))}
                ariaLabel={`Begin ${isList ? data.name : data.tr}`}
              />
            );
          })}
        </ListGroup>
      )}
    </section>
  );

  const renderQuick = () =>
    quick.length > 0 && (
      <section key="quick" aria-labelledby="quick-h" className="space-y-4">
        <SectionHeader
          id="quick-h"
          title="Collections"
          action={
            <Button variant="link" size="sm" onClick={() => openLibrary()}>
              All sets
            </Button>
          }
        />
        <div className="scroll-fade-x -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0 lg:mask-none">
          {quick.map((k) => (
            <button key={k} type="button" onClick={() => openLibrary(k)} className="chip">
              {OCCASIONS[k]}
            </button>
          ))}
        </div>
      </section>
    );

  /* Remedies read as an index: "When you are anxious", not six cards. */
  const renderRemedies = () => (
    <section key="remedies" aria-labelledby="remedies-h" className="space-y-4">
      <SectionHeader id="remedies-h" title="When the heart needs it" />
      <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1 xl:grid-cols-2">
        {Object.entries(EMOTIONAL_REMEDIES).map(([key, rem]) => (
          <li key={key} className="border-b border-line">
            <button
              type="button"
              onClick={() => openLibrary(key)}
              className="group flex w-full items-center gap-4 py-4 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-snug text-ink">{rem.short || rem.label}</span>
                <span className="mt-0.5 block text-sm leading-snug text-muted">{rem.desc}</span>
              </span>
              <ArrowRight
                size={18}
                className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );

  /* A Name of Allah for the day, set large. Gives the page a quiet end. */
  const renderName = () => {
    const idx = dayOfYear(d) % SEED_NAMES_OF_ALLAH.length;
    const name = SEED_NAMES_OF_ALLAH[idx];
    if (!name) return null;
    return (
      <section key="asmaul_husna" aria-labelledby="name-h" className="rounded-2xl bg-sunken px-6 py-8 text-center lg:py-10">
        <p className="eyebrow">Name of the day · {idx + 1} of 99</p>
        <p dir="rtl" lang="ar" className="mt-5 font-arabic text-[3.5rem] leading-[1.5] text-ink">
          {name.arabic}
        </p>
        <h2 id="name-h" className="mt-1 font-display text-2xl text-ink">
          {name.tr}
        </h2>
        <p className="mx-auto mt-1 max-w-[30ch] text-[0.9375rem] text-muted">
          {settings.lang === "ur" ? name.ur || name.en : name.en}
        </p>
        <Button
          variant="secondary"
          size="sm"
          iconRight={ArrowRight}
          className="mt-6"
          onClick={() => navigate("/names")}
        >
          The 99 Names
        </Button>
      </section>
    );
  };

  const renderPrayer = () =>
    settings?.prayer?.enabled && settings?.prayer?.showOnHome ? <PrayerTimesCard key="prayer" /> : null;

  const renderers = {
    suggested: () => null, // the lead below replaces the old suggested card
    prayer: renderPrayer,
    streak: renderProgress,
    pinned: renderPinned,
    quick: renderQuick,
    remedies: renderRemedies,
    asmaul_husna: renderName,
  };

  const homeSections =
    settings?.homeSections && settings.homeSections.length > 0 ? settings.homeSections : DEFAULT_HOME_SECTIONS;
  const visible = homeSections.filter((s) => s.visible && renderers[s.key]);
  const showLead = resumable || visible.some((s) => s.key === "suggested");
  const render = (keys) => visible.filter((s) => keys.includes(s.key)).map((s) => renderers[s.key]());

  const footer = (
    <footer className="flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
      <p>Your counts stay on this device. No account, no tracking.</p>
      <Button variant="link" size="sm" icon={Plus} onClick={() => navigate("/library?tab=mine")} className="-ml-2">
        Create your own set
      </Button>
    </footer>
  );

  const seoTitle = (
    <h1 className="sr-only">Free Online Tasbeeh Counter, Digital Dhikr &amp; Zikr Counter</h1>
  );

  if (isDesktop) {
    return (
      <div className="space-y-12">
        {seoTitle}
        <HomeIntro />
        <div className="grid grid-cols-[minmax(0,1fr)_22rem] items-start gap-12">
          <div className="space-y-12">
            {showLead && renderLead()}
            {render(["pinned", "quick", "remedies"])}
          </div>
          <aside className="sticky top-12 space-y-12">{render(["streak", "prayer", "asmaul_husna"])}</aside>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {seoTitle}
      <HomeIntro />
      {showLead && renderLead()}
      {visible.map((s) => renderers[s.key]())}
      {footer}
    </div>
  );
};

export default HomeView;
