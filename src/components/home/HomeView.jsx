import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Flame,
  Pin,
  Sparkles,
  Plus,
  Search,
  X,
  ChevronDown,
  Star,
  Moon,
  Sun,
  Mountain,
  ExternalLink,
  Share2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useIsDesktop } from "../../hooks/useMediaQuery";
import { fmt, computeStreak, dateKey } from "../../utils/stats";
import HomeIntro from "./HomeIntro";
import AdhkarChecklist from "./AdhkarChecklist";
import DuaSection from "../duas/DuaSection";
import DuaSheet from "../duas/DuaSheet";
import WeekReflection from "../stats/WeekReflection";
import ShareSheet from "../common/ShareSheet";
import { resolveHomeSections } from "../../utils/homeSections";
import { useNow } from "../../hooks/useNow";
import { useOccasions } from "../../hooks/useOccasions";
import PrayerTimesCard from "../prayer/PrayerTimesCard";
import {
  Panel,
  SectionHeader,
  ListGroup,
  ListRow,
  IconTile,
  DhikrTile,
  ProgressBar,
} from "../common/Layout";
import { Button } from "../common/Button";
import {
  ICONS,
  OCCASIONS,
  DEFAULT_QUICK_COLLECTIONS,
  EMOTIONAL_REMEDIES,
  SEED_NAMES_OF_ALLAH,
} from "../../constants/dhikrData";

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

const FREQUENT_MAX = 10;

// Pinned rows shown before "Show all"; a search appears past this.
const PINNED_PEEK = 4;

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
    dhikrs,
    pinned,
    stats,
    startList,
    startDhikr,
    setSearchQuery,
    session,
    complete,
    settings,
    dById,
    startNamesSession,
    setSettings,
  } = useApp();
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

  const [pinQuery, setPinQuery] = useState("");
  const [pinAll, setPinAll] = useState(false);
  const pq = pinQuery.trim().toLowerCase();
  const pinMatches = pq
    ? pinnedItems.filter(({ type, data }) =>
        (type === "list"
          ? [data.name, ...data.steps.map((s) => dById(s.dhikr)?.tr)]
          : [data.tr, data.en, data.arabic]
        ).some((v) => v && v.toLowerCase().includes(pq)),
      )
    : pinnedItems;
  const pinShown = pq || pinAll ? pinMatches : pinMatches.slice(0, PINNED_PEEK);

  // Ranked by completed sets and rounds; the latest breaks ties.
  const completed = stats.completed || {};
  const frequent = [
    ...lists.map((l) => ({ type: "list", data: l })),
    ...dhikrs.map((x) => ({ type: "dhikr", data: x })),
  ]
    .map((f) => ({
      ...f,
      n: completed[f.data.id]?.n || 0,
      last: completed[f.data.id]?.last || 0,
    }))
    .filter((f) => f.n > 0)
    .sort((a, b) => b.n - a.n || b.last - a.last)
    .slice(0, FREQUENT_MAX);

  // A seasonal set leads when the Hijri date calls for one; others follow it.
  const occasions = useOccasions();
  const [occ, ...alsoOcc] = occasions;
  const [duaOpen, setDuaOpen] = useState(false);
  const [sharingName, setSharingName] = useState(false);
  const nameIdx = dayOfYear(d) % SEED_NAMES_OF_ALLAH.length;
  const nameCard = useMemo(() => {
    const n = SEED_NAMES_OF_ALLAH[nameIdx];
    return n && { eyebrow: `Name of the day · ${nameIdx + 1} of 99`, arabic: n.arabic, title: n.tr, meaning: n.en, source: "", filename: `${n.tr.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png` };
  }, [nameIdx]);

  const sug = suggestionFor(d.getHours());
  const suggest = lists.find((l) => l.id === sug.id) || lists[0];

  const resumable = session && !complete && session.counts.some((c) => c > 0);

  const quickKeys =
    settings?.quickCollections && settings.quickCollections.length > 0
      ? settings.quickCollections
      : DEFAULT_QUICK_COLLECTIONS;
  const quick = quickKeys.filter((k) => OCCASIONS[k]);

  const openLibrary = (occasion) => {
    setSearchQuery("");
    navigate(
      occasion
        ? `/library?occasion=${encodeURIComponent(occasion)}`
        : "/library",
    );
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
    const first = dById(suggest.steps[0]?.dhikr);
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
        {first && (
          <p
            dir="rtl"
            lang="ar"
            className="mt-4 truncate font-arabic text-[1.5rem] leading-[1.9] text-ink"
          >
            {first.arabic}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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
    const first = dById(set.steps[0]?.dhikr);
    const total = setTotal(set);
    const Icon = OCC_ICONS[occ.icon] || Sparkles;
    return (
      <Panel key="lead" as="section" aria-labelledby="lead-h" className="p-5 lg:p-8">
        <p className="eyebrow flex items-center gap-2 text-gold">
          <Icon size={14} strokeWidth={2} aria-hidden="true" />
          <span>{occ.label}</span>
        </p>
        <h2 id="lead-h" className="mt-2 font-display text-[1.75rem] leading-tight font-medium text-ink lg:text-[2.5rem]">
          {set.name}
        </h2>
        <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-muted">{occ.desc}</p>
        <p className="numerals mt-1.5 text-sm text-muted">
          {set.steps.length} {set.steps.length === 1 ? "dhikr" : "dhikrs"} · {fmt(total)} {total === 1 ? "count" : "counts"}
          {total >= 20 && ` · ${durationLabel(total)}`}
        </p>
        {first && (
          // Short du'as in full; clamping clips the harakat, so long ones stay on one line.
          <p
            dir="rtl"
            lang="ar"
            className={`mt-4 font-arabic text-[1.5rem] leading-[1.9] text-ink ${first.arabic.replace(/[\u064B-\u065F\u0670]/g, "").length > 60 ? "truncate" : ""}`}
          >
            {first.arabic}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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
      </Panel>
    );
  };

  /* ── Daily progress: one line of figures, no card ───────────────────── */
  const renderProgress = () => (
    <section key="streak" aria-label="Daily progress" className="space-y-4">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="numerals font-display text-[2.25rem] leading-none text-ink">
            {fmt(today)}
          </p>
          <p className="numerals mt-2 text-sm text-muted">
            of {fmt(goal)} today
          </p>
        </div>
        <dl className="flex gap-6 text-right">
          <div>
            <dt className="text-sm text-muted">Streak</dt>
            <dd className="numerals mt-1 flex items-center justify-end gap-1 font-display text-2xl leading-none text-ink">
              {streak > 0 && (
                <Flame size={16} className="text-gold" aria-hidden="true" />
              )}
              {streak}
              <span className="sr-only"> days</span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">All time</dt>
            <dd className="numerals mt-1 font-display text-2xl leading-none text-ink">
              {fmt(stats.total)}
            </dd>
          </div>
        </dl>
      </div>
      <ProgressBar
        value={today}
        max={goal}
        label="Today's goal"
        tone={today >= goal ? "gold" : "accent"}
      />
      {today >= goal && (
        <p className="text-sm text-muted">
          Today&rsquo;s goal is complete. Alhamdulillah.
        </p>
      )}
    </section>
  );

  const renderPinned = () => (
    <section key="pinned" aria-labelledby="pinned-h" className="space-y-4">
      <SectionHeader
        id="pinned-h"
        title="Your dhikr"
        count={pinnedItems.length > PINNED_PEEK ? pinnedItems.length : null}
        action={
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/library?tab=mine")}
          >
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
            Pin the sets you recite every day and they&rsquo;ll wait for you
            here.
          </p>
          <Button variant="secondary" size="sm" onClick={() => openLibrary()}>
            Browse library
          </Button>
        </Panel>
      ) : (
        <>
          {pinnedItems.length > PINNED_PEEK && (
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={pinQuery}
                onChange={(e) => setPinQuery(e.target.value)}
                placeholder={`Find in your ${pinnedItems.length}`}
                aria-label="Find in your dhikr"
                className="field-input pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
              />
              {pinQuery && (
                <button
                  type="button"
                  onClick={() => setPinQuery("")}
                  aria-label="Clear search"
                  className="icon-btn absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 text-muted"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
          {pinShown.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line px-5 py-6 text-center text-[0.9375rem] text-muted">
              Nothing pinned matches &ldquo;{pinQuery.trim()}&rdquo;. Try a
              shorter word.
            </p>
          ) : (
            <ListGroup id="pinned-list">
              {pinShown.map(({ type, data }) => {
                const isList = type === "list";
                const Ico = isList ? ICONS[data.icon] || Sparkles : null;
                const count = isList ? setTotal(data) : data.target;
                return (
                  <ListRow
                    key={data.id}
                    leading={isList ? <IconTile icon={Ico} /> : <DhikrTile />}
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
                    onClick={() =>
                      isList ? startList(data) : startDhikr(data)
                    }
                    ariaLabel={`Begin ${isList ? data.name : data.tr}`}
                  />
                );
              })}
              {!pq && pinMatches.length > PINNED_PEEK && (
                <button
                  type="button"
                  onClick={() => setPinAll((v) => !v)}
                  aria-expanded={pinAll}
                  aria-controls="pinned-list"
                  className="row-interactive flex min-h-12 w-full items-center justify-center gap-1.5 px-4 text-sm font-medium text-accent"
                >
                  {pinAll ? "Show fewer" : `Show all ${pinMatches.length}`}
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={pinAll ? "rotate-180" : ""}
                  />
                </button>
              )}
            </ListGroup>
          )}
        </>
      )}
    </section>
  );

  const renderFrequent = () => (
    <section key="frequent" aria-labelledby="frequent-h" className="space-y-4">
      <SectionHeader id="frequent-h" title="Most recited" />
      {frequent.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-5 py-5 text-[0.9375rem] leading-relaxed text-muted">
          Finish a set and it appears here, ranked by how often you complete it.
        </p>
      ) : (
        <ol className="scroll-fade-x -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:mask-none">
          {frequent.map(({ type, data, n }, i) => {
            const isList = type === "list";
            const name = isList ? data.name : data.tr;
            const usage = `Completed ${fmt(n)} ${n === 1 ? "time" : "times"}`;
            return (
              <li key={data.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => (isList ? startList(data) : startDhikr(data))}
                  aria-label={`Begin ${name}, ${usage}`}
                  className="row-interactive flex h-[7.5rem] w-[10rem] flex-col justify-between rounded-2xl border border-line bg-surface p-3.5 text-left lg:w-full"
                >
                  <span className="flex w-full items-start justify-between">
                    {isList ? (
                      <IconTile icon={ICONS[data.icon] || Sparkles} size={32} />
                    ) : (
                      <DhikrTile size={32} />
                    )}
                    <span
                      className="numerals font-display text-lg leading-none text-muted"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-[0.9375rem] leading-snug font-medium text-ink [overflow-wrap:anywhere]">
                      {name}
                    </span>
                    <span className="numerals mt-1 block truncate text-sm text-muted">
                      {usage}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
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
            <button
              key={k}
              type="button"
              onClick={() => openLibrary(k)}
              className="chip"
            >
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
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Object.entries(EMOTIONAL_REMEDIES).map(([key, rem]) => (
          <li key={key} className="min-w-0">
            <button
              type="button"
              onClick={() => openLibrary(key)}
              aria-label={`${rem.short || rem.label}: ${rem.desc}`}
              className="row-interactive flex min-h-14 w-full items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-left"
            >
              <span className="min-w-0 font-display text-[1.0625rem] leading-snug text-ink">{rem.short || rem.label}</span>
              <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden="true" />
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
      <section
        key="asmaul_husna"
        aria-labelledby="name-h"
        className="rounded-2xl border border-line bg-surface p-1.5"
      >
        {/* Inner rule: a manuscript-style double border. */}
        <div className="relative overflow-hidden rounded-[0.875rem] border border-[color-mix(in_srgb,var(--gold)_38%,var(--line))] px-5 pb-5 pt-6 text-center">
          <div className="relative">
            <p className="eyebrow flex items-center justify-center gap-2 text-gold">
              <span>Name of the day</span>
              <span
                className="h-px w-4 bg-current opacity-60"
                aria-hidden="true"
              />
              <span className="numerals">{idx + 1} of 99</span>
            </p>
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
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <Button
                variant="secondary"
                size="sm"
                iconRight={ArrowRight}
                onClick={() => startNamesSession(idx)}
              >
                Reflect on this Name
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/names")}
              >
                All 99
              </Button>
              <Button variant="link" size="sm" icon={Share2} onClick={() => setSharingName(true)}>
                Share
              </Button>
            </div>
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
    pinned: renderPinned,
    frequent: renderFrequent,
    adhkar: () => <AdhkarChecklist key="adhkar" />,
    duas: () => <DuaSection key="duas" />,
    // Fridays only, until put away for the week.
    reflection: () =>
      d.getDay() === 5 && settings.reflectionSeen !== dateKey(d) ? (
        <WeekReflection key="reflection" variant="today" onDismiss={() => setSettings((s) => ({ ...s, reflectionSeen: dateKey(d) }))} />
      ) : null,
    quick: renderQuick,
    remedies: renderRemedies,
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
    <footer className="flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
      <p>Your counts stay on this device. No account, no tracking.</p>
      <Button
        variant="link"
        size="sm"
        icon={Plus}
        onClick={() => navigate("/library?tab=mine")}
        className="-ml-2"
      >
        Create your own set
      </Button>
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
            {render(["reflection", "adhkar", "duas", "frequent", "pinned", "quick", "remedies"])}
          </div>
          <aside className="sticky top-12 space-y-12">
            {render(["streak", "prayer", "asmaul_husna"])}
          </aside>
        </div>
        {footer}
        <DuaSheet open={duaOpen} onClose={() => setDuaOpen(false)} />
        <ShareSheet open={sharingName} onClose={() => setSharingName(false)} card={nameCard} />
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
      <ShareSheet open={sharingName} onClose={() => setSharingName(false)} card={nameCard} />
    </div>
  );
};

export default HomeView;
