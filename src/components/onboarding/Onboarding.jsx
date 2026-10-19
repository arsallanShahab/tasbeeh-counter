import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, CircleAlert, MapPin } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, IconButton } from "../common/Button";
import { TextInput } from "../common/Field";
import Seg from "../common/Seg";
import Toggle from "../common/Toggle";
import { SetIcon } from "../common/ShelfArt";
import { fmtTime } from "../../utils/prayerTimes";
import { THEMES } from "../../constants/dhikrData";
import { haptic, sound } from "../../utils/feedback";

const GOALS = [
  { v: 33, l: "33 a day", hint: "Under a minute. A gentle start." },
  { v: 100, l: "100 a day", hint: "About two minutes, one round of a set." },
  { v: 300, l: "300 a day", hint: "About five minutes, spread through the day." },
  { v: 1000, l: "1,000 a day", hint: "About fifteen minutes, for a steady habit." },
];
const LANGS = { en: "English", ur: "Urdu", both: "English and Urdu" };
const REMINDER_IDS = ["morning", "evening", "sleep"];

// One of several choices, each a full-width row with a plain explanation.
const Choices = ({ label, options, value, onChange }) => {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {options.map((o) => {
        const on = o.v === value;
        return (
          <label
            key={o.v}
            className="row-interactive relative flex min-h-[3.75rem] cursor-pointer items-center gap-3 px-4 py-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-accent"
          >
            <input type="radio" name={name} checked={on} onChange={() => onChange(o.v)} className="sr-only" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-medium text-ink">{o.l}</span>
              {o.hint && <span className="mt-0.5 block text-sm leading-snug text-muted">{o.hint}</span>}
            </span>
            <span
              aria-hidden="true"
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-accent bg-accent text-on-accent" : "border-line-strong"}`}
            >
              {on && <Check size={14} strokeWidth={3} />}
            </span>
          </label>
        );
      })}
    </div>
  );
};

// A labelled row in a panel, with its control on the right.
const Row = ({ label, hint, children }) => {
  const id = useId();
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p id={id} className="text-[0.9375rem] font-medium text-ink">
          {label}
        </p>
        {hint && <p className="mt-0.5 text-sm leading-snug text-muted">{hint}</p>}
      </div>
      {typeof children === "function" ? children(id) : children}
    </div>
  );
};

const Caption = ({ children }) => <p className="mb-2 text-sm font-medium text-ink">{children}</p>;

export default function Onboarding({ onDone }) {
  const { settings, setSettings, requestPrayerLocation, notifyPermission, requestNotificationPermission } = useApp();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState(settings.name || "");
  const [loc, setLoc] = useState({ state: "idle", error: "" });
  const [askedNotify, setAskedNotify] = useState(false);
  const [tries, setTries] = useState(0);
  const headingRef = useRef(null);

  const p = settings.prayer || {};
  const hasLoc = p.location?.lat != null && p.location?.lng != null;
  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));
  const setPrayer = (patch) => setSettings((s) => ({ ...s, prayer: { ...s.prayer, ...patch } }));
  const alertOn = (id) => !!settings.alertsEnabled && !!settings.alerts?.find((a) => a.id === id)?.enabled;
  const setAlert = (id, on) =>
    setSettings((s) => {
      const alerts = s.alerts.map((a) => (a.id === id ? { ...a, enabled: on } : a));
      return { ...s, alerts, alertsEnabled: alerts.some((a) => a.enabled) };
    });
  const prayerReminders = !!p.reminders?.enabled;
  const anyReminder = REMINDER_IDS.some(alertOn) || prayerReminders;
  const notifySupported = typeof window !== "undefined" && "Notification" in window;

  const finish = () => {
    setSettings((s) => ({ ...s, name: name.trim().slice(0, 40), onboarded: true }));
    onDone();
  };

  const STEPS = ["welcome", "name", "reading", "goal", "prayer", "reminders", "feel", "done"];
  const key = STEPS[step];
  const go = (d) => {
    if (d > 0) haptic("tap", { enabled: settings.haptics, strength: settings.hapticStrength });
    setDir(d);
    setStep((s) => Math.min(Math.max(s + d, 0), STEPS.length - 1));
  };

  useEffect(() => {
    if (step > 0) headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const next = async () => {
    if (key === "name" && name.trim().slice(0, 40) !== (settings.name || "")) set({ name: name.trim().slice(0, 40) });
    if (key === "reminders" && anyReminder && notifySupported && notifyPermission !== "granted" && !askedNotify) {
      setAskedNotify(true);
      const ok = await requestNotificationPermission();
      if (!ok) return; // stay, so the note about blocked notifications is read
    }
    if (key === "done") return finish();
    go(1);
  };

  const locate = async () => {
    setLoc({ state: "loading", error: "" });
    try {
      await requestPrayerLocation();
      setLoc({ state: "idle", error: "" });
    } catch (e) {
      setLoc({
        state: "idle",
        error:
          e?.code === 1
            ? "Location is turned off for Tasbeeh Go. You can allow it later, or type in coordinates in Settings."
            : "Your location couldn't be found just now. You can try again, or set it later in Settings.",
      });
    }
  };

  const reminderTime = (id) => {
    const t = settings.alerts?.find((a) => a.id === id)?.time || "08:00";
    const [h, m] = t.split(":").map(Number);
    return fmtTime(new Date(2000, 0, 1, h, m), p.hour12);
  };

  const content = {
    welcome: {
      title: "Assalamu alaikum",
      body: "Tasbeeh Go is a quiet companion for your daily dhikr. Answer a few short questions and it will be set up the way you like. It takes about a minute.",
    },
    name: {
      art: "profile",
      title: "What should we call you?",
      body: "Your name is used for your greeting on Today. It stays on this device.",
      ui: (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
        >
          <label htmlFor="ob-name" className="sr-only">
            Your name
          </label>
          <TextInput
            id="ob-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            autoComplete="given-name"
            maxLength={40}
            enterKeyHint="next"
          />
        </form>
      ),
    },
    reading: {
      art: "quran",
      title: "How would you like to read?",
      body: "Every dhikr shows the Arabic. Choose what appears with it.",
      ui: (
        <div className="space-y-6">
          <div>
            <Caption>Translation</Caption>
            <Seg
              label="Translation language"
              value={settings.lang}
              onChange={(v) => set({ lang: v })}
              options={[
                { v: "en", l: "English" },
                { v: "ur", l: "اردو", dir: "rtl" },
                { v: "both", l: "Both" },
              ]}
            />
          </div>
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            <Row label="Transliteration" hint="The Arabic in English letters, to help you pronounce it.">
              {(id) => (
                <Toggle
                  labelledBy={id}
                  on={settings.dhikrFieldVisible?.translit !== false}
                  onClick={() =>
                    setSettings((s) => ({ ...s, dhikrFieldVisible: { ...s.dhikrFieldVisible, translit: s.dhikrFieldVisible?.translit === false } }))
                  }
                />
              )}
            </Row>
          </div>
          <div>
            <Caption>Arabic size</Caption>
            <Seg
              label="Arabic size"
              value={settings.arabicScale ?? 1}
              onChange={(v) => set({ arabicScale: v })}
              options={[
                { v: 0.875, l: "Small" },
                { v: 1, l: "Default" },
                { v: 1.15, l: "Large" },
              ]}
            />
            <p className="mt-3 text-center font-arabic text-ink" style={{ fontSize: `${1.75 * (settings.arabicScale ?? 1)}rem`, lineHeight: 1.8 }} dir="rtl" lang="ar">
              سُبْحَانَ اللهِ
            </p>
          </div>
          <div>
            <Caption>Light or dark</Caption>
            <p className="-mt-1 mb-2 text-sm text-muted">Setup stays light; your choice applies when you finish.</p>
            <Seg
              label="Appearance"
              value={settings.appearance || "system"}
              onChange={(v) => set({ appearance: v })}
              options={[
                { v: "light", l: "Light" },
                { v: "dark", l: "Dark" },
                { v: "system", l: "Match device" },
              ]}
            />
          </div>
        </div>
      ),
    },
    goal: {
      art: "tasbeeh",
      title: "Set a daily goal",
      body: "A number of counts to aim for each day. Small and steady is best, and you can change it any time.",
      ui: <Choices label="Daily goal" options={GOALS} value={settings.dailyGoal} onChange={(v) => set({ dailyGoal: v })} />,
    },
    prayer: {
      art: "prayer-times",
      title: "Prayer times",
      body: "See today's prayer times and the qibla. They are worked out on this device from your location, which is never sent anywhere.",
      ui: (
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-4">
            {hasLoc ? (
              <p className="flex items-center gap-2.5 text-[0.9375rem] font-medium text-ink">
                <MapPin size={18} className="shrink-0 text-accent" aria-hidden="true" />
                <span className="min-w-0">{p.location.label || "Location saved"}</span>
                <Check size={18} className="ml-auto shrink-0 text-accent" aria-label="Saved" />
              </p>
            ) : (
              <Button variant="secondary" icon={MapPin} loading={loc.state === "loading"} onClick={locate} block>
                Use my location
              </Button>
            )}
            {loc.error && (
              <p className="mt-3 flex items-start gap-1.5 text-sm text-danger" role="alert">
                <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {loc.error}
              </p>
            )}
          </div>
          <div>
            <Caption>Asr time</Caption>
            <Choices
              label="Asr time"
              value={p.madhhab}
              onChange={(v) => setPrayer({ madhhab: v })}
              options={[
                { v: "shafi", l: "Standard", hint: "Shafi'i, Maliki and Hanbali." },
                { v: "hanafi", l: "Hanafi", hint: "Asr begins a little later." },
              ]}
            />
          </div>
        </div>
      ),
    },
    reminders: {
      art: "notifications",
      title: "Gentle reminders",
      body: "A quiet notification when it's time. Pick the ones you'd like.",
      ui: (
        <div className="space-y-4">
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            <Row label="Morning adhkar" hint={reminderTime("morning")}>
              {(id) => <Toggle labelledBy={id} on={alertOn("morning")} onClick={() => setAlert("morning", !alertOn("morning"))} />}
            </Row>
            <Row label="Evening adhkar" hint={reminderTime("evening")}>
              {(id) => <Toggle labelledBy={id} on={alertOn("evening")} onClick={() => setAlert("evening", !alertOn("evening"))} />}
            </Row>
            <Row label="Before sleep" hint={reminderTime("sleep")}>
              {(id) => <Toggle labelledBy={id} on={alertOn("sleep")} onClick={() => setAlert("sleep", !alertOn("sleep"))} />}
            </Row>
            {hasLoc && (
              <Row label="At each prayer time">
                {(id) => (
                  <Toggle
                    labelledBy={id}
                    on={prayerReminders}
                    onClick={() => setPrayer({ reminders: { ...p.reminders, enabled: !prayerReminders } })}
                  />
                )}
              </Row>
            )}
          </div>
          {!notifySupported ? (
            <p className="text-sm leading-relaxed text-muted">This browser can't show notifications. Install Tasbeeh Go on your phone to get reminders.</p>
          ) : notifyPermission === "denied" || (askedNotify && notifyPermission !== "granted") ? (
            <p className="flex items-start gap-1.5 text-sm leading-relaxed text-danger" role="alert">
              <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              Notifications are blocked for Tasbeeh Go. You can allow them in your device settings, or carry on without them.
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted">You can change the times in Settings.</p>
          )}
        </div>
      ),
    },
    feel: {
      art: "favorites",
      title: "Feel each count",
      body: "A light tick as you count, so you can keep your eyes closed. Try it below.",
      ui: (
        <div className="space-y-6">
          <div>
            <Caption>Vibration</Caption>
            <Seg
              label="Vibration"
              value={settings.haptics ? settings.hapticStrength || "soft" : "off"}
              onChange={(v) => setSettings((s) => ({ ...s, haptics: v !== "off", hapticStrength: v === "off" ? s.hapticStrength : v }))}
              options={[
                { v: "off", l: "Off" },
                { v: "soft", l: "Soft" },
                { v: "firm", l: "Firm" },
              ]}
            />
          </div>
          <div>
            <Caption>Sound</Caption>
            <Seg
              label="Sound"
              value={settings.sound ? settings.soundType || "bead" : "off"}
              onChange={(v) => {
                setSettings((s) => ({ ...s, sound: v !== "off", soundType: v === "off" ? s.soundType : v }));
                if (v !== "off") sound("count", { type: v });
              }}
              options={[
                { v: "off", l: "Off" },
                { v: "bead", l: "Bead" },
                { v: "click", l: "Click" },
              ]}
            />
          </div>
          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setTries((n) => n + 1);
                haptic("count", { enabled: settings.haptics, strength: settings.hapticStrength });
                sound("count", { enabled: settings.sound, type: settings.soundType });
              }}
              className="numerals flex size-24 items-center justify-center rounded-full bg-accent font-display text-3xl text-on-accent shadow-(--shadow-raise) transition-transform duration-100 active:scale-95"
              aria-label={`Try a count. ${tries} so far`}
            >
              {tries}
            </button>
            <span className="text-sm text-muted">Tap to try</span>
          </div>
        </div>
      ),
    },
    done: {
      art: "occasions",
      title: `You're all set${name.trim() ? `, ${name.trim()}` : ""}`,
      body: "Here is what you chose. Change any of it in Settings.",
      ui: (
        <dl className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {[
            ["Daily goal", `${Number(settings.dailyGoal).toLocaleString()} counts`],
            ["Translation", LANGS[settings.lang] || "English"],
            ["Prayer times", hasLoc ? p.location.label || "Location saved" : "Not set yet"],
            ["Reminders", anyReminder ? `${REMINDER_IDS.filter(alertOn).length + (prayerReminders ? 1 : 0)} on` : "Off"],
            ["Vibration", settings.haptics ? (settings.hapticStrength === "firm" ? "Firm" : "Soft") : "Off"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="min-w-0 text-right text-[0.9375rem] font-medium text-ink [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  }[key];

  const total = STEPS.length - 2; // the questions between welcome and done
  const cta = key === "welcome" ? "Get started" : key === "done" ? "Go to Today" : "Continue";

  const welcome = key === "welcome";
  const art = (big) =>
    welcome ? (
      <img
        src="/intro-onboard.webp"
        alt=""
        width={720}
        height={783}
        decoding="async"
        fetchPriority="high"
        className={big ? "h-auto w-[min(26rem,80%)] object-contain" : "mx-auto h-auto w-[min(17rem,68vw)] max-h-[40svh] object-contain"}
      />
    ) : (
      <SetIcon name={content.art} size={big ? 200 : 80} tile={!big} />
    );
  const ease = [0.22, 1, 0.36, 1];
  // Direction is read when each screen leaves, so Back slides the old one out to the right.
  const slide = {
    enter: (d) => ({ opacity: 0, x: d * 32 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.26, ease } },
    exit: (d) => ({ opacity: 0, x: d * -32, transition: { duration: 0.12, ease: [0.4, 0, 1, 1] } }),
  };
  // The welcome arrives in a short sequence: picture, words, then the button.
  const rise = (i) => (welcome ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.32, delay: 0.06 + i * 0.07, ease } } } : {});

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ob-title"
      data-theme="light"
      style={{ ...(THEMES[settings.theme] || THEMES.qalam).light, colorScheme: "light" }}
      className="fixed inset-0 z-[80] flex bg-page text-ink"
    >
      {/* Desktop: the picture has its own panel. */}
      <aside aria-hidden="true" className="relative hidden flex-1 items-center justify-center overflow-hidden bg-page-2 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_10%,transparent),transparent)]" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            className="relative flex w-full justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.14, ease: "easeIn" } }}
          >
            {art(true)}
          </motion.div>
        </AnimatePresence>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:max-w-[36rem]">
        <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden lg:max-w-none lg:justify-center lg:overflow-y-auto lg:px-10 lg:py-24">
          {!welcome && (
            <header className="flex h-14 shrink-0 items-center gap-2 px-3 lg:absolute lg:inset-x-10 lg:top-6 lg:px-0">
              <div className="w-11">
                <IconButton icon={ArrowLeft} label="Back" onClick={() => go(-1)} />
              </div>
              <div className="flex flex-1 justify-center">
                {key !== "done" && (
                  <div className="flex w-full max-w-[12rem] gap-1" role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-valuetext={`Step ${step} of ${total}`}>
                    {Array.from({ length: total }, (_, i) => (
                      <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-200 ${i < step ? "bg-accent" : "bg-line"}`} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex w-11 justify-end">
                {key !== "done" && (
                  <button type="button" onClick={finish} className="min-h-11 rounded-lg px-2 text-sm font-medium text-muted hover:text-ink">
                    Skip
                  </button>
                )}
              </div>
            </header>
          )}

          <div className="relative flex-1 overflow-y-auto overflow-x-hidden lg:flex-none lg:overflow-visible">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.section
                key={key}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className={`px-6 pb-10 lg:px-0 ${welcome ? "flex min-h-full flex-col justify-center text-center lg:text-left" : "pt-2 lg:pt-0"}`}
              >
                <motion.div {...rise(0)} className={`relative lg:hidden ${welcome ? "" : "-ml-1"}`}>
                  {welcome && <div aria-hidden="true" className="absolute inset-x-0 top-1/2 mx-auto aspect-square w-[min(22rem,90vw)] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_11%,transparent),transparent)]" />}
                  <div className="relative">{art(false)}</div>
                </motion.div>
                {!welcome && key !== "done" && <p className="eyebrow mt-6 lg:mt-0">Step {step} of {total}</p>}
                <motion.h1
                  {...rise(1)}
                  id="ob-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className={`font-display font-medium tracking-[-0.01em] text-ink outline-none [overflow-wrap:anywhere] ${
                    welcome ? "mt-8 text-[2.75rem] leading-[1.04] lg:mt-0 lg:text-6xl" : `${key === "done" ? "mt-6 lg:mt-0" : "mt-2"} text-[2.25rem] leading-[1.08] lg:text-5xl`
                  }`}
                >
                  {content.title}
                </motion.h1>
                <motion.p
                  {...rise(2)}
                  className={`mt-3 text-[0.9375rem] leading-relaxed text-muted lg:text-base ${welcome ? "mx-auto max-w-[34ch] lg:mx-0" : "max-w-[44ch]"}`}
                >
                  {content.body}
                </motion.p>
                {content.ui && <div className="mt-7">{content.ui}</div>}
              </motion.section>
            </AnimatePresence>
          </div>

          <motion.footer {...rise(3)} className="relative shrink-0 px-6 pt-2 pb-5 lg:px-0 lg:pt-0 lg:pb-0">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-page to-transparent lg:hidden" />
            <Button size="lg" block onClick={next}>
              {cta}
            </Button>
            {welcome && (
              <button type="button" onClick={finish} className="mt-2 min-h-11 w-full rounded-lg text-sm font-medium text-muted hover:text-ink">
                Skip and use the defaults
              </button>
            )}
          </motion.footer>
        </div>
      </div>
    </div>
  );
}
