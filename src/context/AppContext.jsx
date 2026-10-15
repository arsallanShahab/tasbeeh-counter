import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { resolveHomeSections } from "../utils/homeSections";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SEED_DHIKRS, SEED_LISTS, DEFAULT_SETTINGS, STORAGE_VERSION, SEED_NAMES_OF_ALLAH } from "../constants/dhikrData";
import { store } from "../utils/storage";
import { downloadBackup } from "../utils/backup";
import { dateKey } from "../utils/stats";
import { prayerSchedule, buildPrayerAlerts, getCurrentPosition, timezoneCity } from "../utils/prayerTimes";
import { regionalHijriOffset } from "../utils/hijri";
import { WebHaptics } from "web-haptics";

const AppContext = createContext(null);

// Injected by Vite (see vite.config.js → define). In dev, esbuild substitutes
// the literal; in build, the production version. Falls back to a sentinel.
const APP_VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0.0.0-dev";

const VALID_VIEWS = ["home", "library", "stats", "settings", "counter", "names", "qibla"];

const pathToView = (pathname) => {
  const p = (pathname || "/").replace(/^\//, "").replace(/\/$/, "") || "home";
  return VALID_VIEWS.includes(p) ? p : "home";
};

const viewToPath = (view) => (view === "home" ? "/" : `/${view}`);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const view = pathToView(location.pathname);
  /* Editor sheets are plain state, not URL params. The Sheet itself adds a
     history entry while open, so the back gesture still closes it. */
  const [editor, setEditor] = useState(null); // { kind: "dhikr" | "list", id } | null
  const modal = editor?.kind || null;
  const editId = editor?.id || null;
  const activeOccasion = searchParams.get("occasion") || "all";

  const [loaded, setLoaded] = useState(false);
  const [dhikrs, setDhikrs] = useState(() => [...SEED_DHIKRS, ...SEED_NAMES_OF_ALLAH]);
  const [lists, setLists] = useState(SEED_LISTS);
  const [pinned, setPinned] = useState(["after-salah", "istighfar-100", "durood-100"]);
  const [stats, setStats] = useState({ total: 0, byDate: {}, perDhikr: {} });
  const [settings, setSettingsInternal] = useState(DEFAULT_SETTINGS);

  const [session, setSession] = useState(null);
  const [namesSession, setNamesSession] = useState(() => ({
    index: 0,
    counts: Array(99).fill(0),
    targets: Array(99).fill(100)
  }));

  /* Live mirrors of the two counting sessions.

     State updaters must be pure. React StrictMode invokes every queued updater
     twice in development, so a setStats / vibe / setTimeout sitting inside one
     runs twice — which is exactly how a single tap used to score two in the
     stats, fire two haptics, and schedule two auto-advances. Everything derived
     now happens in the callbacks below, which read the session from these refs.

     A ref rather than the `session` closure because BeadRing's drag can fire
     several increments inside one pointermove event: each needs to see the
     previous one's result, and state won't have committed yet. */
  const sessionRef = useRef(session);
  const namesSessionRef = useRef(namesSession);
  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { namesSessionRef.current = namesSession; }, [namesSession]);

  const [complete, setComplete] = useState(false);
  const [targetEdit, setTargetEditInternal] = useState(false);
  const [customT, setCustomT] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifyPermission, setNotifyPermission] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  // Prayer-time reminders are projected into the same alert schema as the
  // manual daily reminders, but regenerated each day because prayer times
  // shift. They live in their own state and are merged at sync/check time.
  const [prayerAlerts, setPrayerAlerts] = useState([]);

  // PWA install + app-update state
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const swRegistrationRef = useRef(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  });

  // Router-based navigation. Pass { replace: true } when leaving from a sheet,
  // so the sheet's own history entry is replaced rather than left behind.
  const setView = useCallback(
    (newView, opts) => {
      navigate(viewToPath(newView), opts);
    },
    [navigate]
  );

  const setModal = useCallback((kind) => setEditor(kind ? { kind, id: null } : null), []);
  const openEditor = useCallback((kind, id = null) => setEditor({ kind, id }), []);

  const setActiveOccasion = useCallback(
    (newOccasion) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!newOccasion || newOccasion === "all") next.delete("occasion");
          else next.set("occasion", newOccasion);
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );
  
  const saveTimer = useRef(null);
  const audioRef = useRef(null);

  /* Load state from storage on init */
  useEffect(() => {
    const loadState = async () => {
      const storedVersion = store.get("storage_version", 1);
      
      let loadedDhikrs = store.get("dhikrs", null);
      let loadedLists = store.get("lists", null);
      
      if (!loadedDhikrs || !loadedLists || storedVersion < STORAGE_VERSION) {
        // Upgrade / Migrate required!
        // 1. Keep custom items that user created
        const customDhikrs = loadedDhikrs ? loadedDhikrs.filter(d => d.id.startsWith("c_") || d.tags?.includes("custom")) : [];
        const customLists = loadedLists ? loadedLists.filter(l => l.id.startsWith("c_")) : [];
        
        // 2. Overwrite defaults with new SEED_DHIKRS, SEED_NAMES_OF_ALLAH & SEED_LISTS, appending custom items
        loadedDhikrs = [...SEED_DHIKRS, ...SEED_NAMES_OF_ALLAH, ...customDhikrs];
        loadedLists = [...SEED_LISTS, ...customLists];
        
        // 3. Clear active session on structure upgrade to avoid mismatch crashes
        setSession(null);
        setComplete(false);
        store.set("session", null);
        store.set("complete", false);
        
        // 4. Save migrated arrays to storage
        store.set("dhikrs", loadedDhikrs);
        store.set("lists", loadedLists);
        store.set("storage_version", STORAGE_VERSION);
      } else {
        // Normal load
        setSession(store.get("session", null));
        setComplete(store.get("complete", false));
      }

      // One-time add of the seasonal dhikr and sets, keeping everything else as is.
      if (!store.get("seeds_seasonal_v1", false)) {
        const dIds = ["takbir_eid", "arafah_dua", "iftar_dua"];
        const lIds = ["dhul-hijjah-ten", "arafah-day", "eid-takbir", "last-ten-nights", "iftar"];
        const missing = (have, seed, ids) => seed.filter((x) => ids.includes(x.id) && !have.some((h) => h.id === x.id));
        loadedDhikrs = [...loadedDhikrs, ...missing(loadedDhikrs, SEED_DHIKRS, dIds)];
        loadedLists = [...loadedLists, ...missing(loadedLists, SEED_LISTS, lIds)];
        store.set("dhikrs", loadedDhikrs);
        store.set("lists", loadedLists);
        store.set("seeds_seasonal_v1", true);
      }
      const loadedNamesSession = store.get("names_session", null);
      if (loadedNamesSession) {
        setNamesSession(loadedNamesSession);
      }
      
      setDhikrs(loadedDhikrs);
      setLists(loadedLists);
      setPinned(store.get("pinned", ["after-salah", "istighfar-100", "durood-100"]));
      setStats(store.get("stats", { total: 0, byDate: {}, perDhikr: {} }));
      
      // Load and migrate settings if legacy format
      const loadedSettings = store.get("settings", {});
      if (loadedSettings.theme === "dark" || loadedSettings.theme === "light") {
        loadedSettings.appearance = loadedSettings.theme;
        loadedSettings.theme = "classic";
      }

      // One-time move off the old Pastel default onto Qalam. Pastel stays
      // available in Settings for anyone who wants it back.
      if (!store.get("theme_default_v2", false)) {
        if (!loadedSettings.theme || loadedSettings.theme === "pastel") {
          loadedSettings.theme = "qalam";
          if (loadedSettings.beadTheme === "pastel") loadedSettings.beadTheme = "onyx";
        }
        store.set("theme_default_v2", true);
      }

      // One-time switch to the strand counter as the new default.
      if (!store.get("counter_default_strand_v1", false)) {
        if (!loadedSettings.counterStyle || loadedSettings.counterStyle === "beads") loadedSettings.counterStyle = "strand";
        store.set("settings", loadedSettings);
        store.set("counter_default_strand_v1", true);
      }

      // Older builds saved emoji into reminder titles; they also end up in
      // system notifications, so strip them.
      if (Array.isArray(loadedSettings.alerts)) {
        loadedSettings.alerts = loadedSettings.alerts.map((a) =>
          typeof a?.title === "string"
            ? { ...a, title: a.title.replace(/[\p{Extended_Pictographic}️‍]/gu, "").replace(/\s{2,}/g, " ").trim() }
            : a
        );
      }

      // Lossless alert deep-link schema upgrade
      if (loadedSettings.alerts && Array.isArray(loadedSettings.alerts)) {
        loadedSettings.alerts = loadedSettings.alerts.map((alert) => {
          if (alert.id === "morning" && !alert.targetId) {
            return { ...alert, targetType: "list", targetId: "morning-short" };
          }
          if (alert.id === "evening" && !alert.targetId) {
            return { ...alert, targetType: "list", targetId: "evening-short" };
          }
          if (alert.id === "sleep" && !alert.targetId) {
            return { ...alert, targetType: "list", targetId: "before-sleep" };
          }
          return alert;
        });
      }
      
      // Normalize homeSections to ensure any newly added sections are present
      if (loadedSettings.homeSections && Array.isArray(loadedSettings.homeSections)) {
        // Most recited sits above Your dhikr; older saves appended it last.
        if (!store.get("home_frequent_v2", false)) {
          const hs = loadedSettings.homeSections;
          if (Array.isArray(hs) && hs.some((x) => x.key === "frequent")) {
            const rest = hs.filter((x) => x.key !== "frequent");
            const at = rest.findIndex((x) => x.key === "pinned");
            const f = hs.find((x) => x.key === "frequent");
            loadedSettings.homeSections = at < 0 ? [...rest, f] : [...rest.slice(0, at), f, ...rest.slice(at)];
          }
          store.set("settings", loadedSettings);
          store.set("home_frequent_v2", true);
        }
        loadedSettings.homeSections = resolveHomeSections(loadedSettings.homeSections);

        // One-time correction: an earlier build hid the discovery launchers on
        // Home. We've since decided every section should be visible by default
        // (users hide what they don't want), so re-show them once.
        if (!store.get("home_show_all_v1", false)) {
          const relocated = new Set(["remedies", "quick", "suggested", "asmaul_husna"]);
          loadedSettings.homeSections = loadedSettings.homeSections.map((s) =>
            relocated.has(s.key) ? { ...s, visible: true } : s
          );
          store.set("home_show_all_v1", true);
        }
      }
      
      // Deep-merge the nested `prayer` object so partial/older saves still get
      // any newly-introduced sub-keys (offsets, reminders, location, …).
      const mergedSettings = { ...DEFAULT_SETTINGS, ...loadedSettings };
      mergedSettings.prayer = {
        ...DEFAULT_SETTINGS.prayer,
        ...(loadedSettings.prayer || {}),
        location: { ...DEFAULT_SETTINGS.prayer.location, ...(loadedSettings.prayer?.location || {}) },
        offsets: { ...DEFAULT_SETTINGS.prayer.offsets, ...(loadedSettings.prayer?.offsets || {}) },
        reminders: {
          ...DEFAULT_SETTINGS.prayer.reminders,
          ...(loadedSettings.prayer?.reminders || {}),
          prayers: {
            ...DEFAULT_SETTINGS.prayer.reminders.prayers,
            ...(loadedSettings.prayer?.reminders?.prayers || {}),
          },
        },
      };
      // The regional Hijri ± is now applied live (see hijriDisplayOffset), so
      // undo any earlier static seed to avoid double-counting. A manual value
      // that differs from the old auto-seed is preserved.
      if (!store.get("hijri_live_v2", false)) {
        if ((mergedSettings.prayer.hijriOffset || 0) === regionalHijriOffset()) {
          mergedSettings.prayer.hijriOffset = 0;
        }
        store.set("hijri_region_default_v1", true); // neutralize old migration
        store.set("hijri_live_v2", true);
      }

      setSettingsInternal(mergedSettings);
      setLoaded(true);
    };
    loadState();
  }, []);

  /* Save state to storage (debounced) */
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      store.set("dhikrs", dhikrs);
      store.set("lists", lists);
      store.set("pinned", pinned);
      store.set("stats", stats);
      store.set("settings", settings);
      store.set("session", session);
      store.set("complete", complete);
      store.set("names_session", namesSession);
    }, 700);
    return () => clearTimeout(saveTimer.current);
  }, [dhikrs, lists, pinned, stats, settings, session, complete, namesSession, loaded]);

  /* Write everything now, skipping the debounce. Runs when the page is hidden
     or closed, and before an update reload, so the last taps are never lost. */
  const flushRef = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    flushRef.current = () => {
      store.set("dhikrs", dhikrs);
      store.set("lists", lists);
      store.set("pinned", pinned);
      store.set("stats", stats);
      store.set("settings", settings);
      store.set("session", session);
      store.set("complete", complete);
      store.set("names_session", namesSession);
    };
  }, [loaded, dhikrs, lists, pinned, stats, settings, session, complete, namesSession]);

  useEffect(() => {
    const flush = () => flushRef.current?.();
    const onVis = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /* Utility functions */
  const dById = useCallback((id) => dhikrs.find((d) => d.id === id), [dhikrs]);

  const hapticsRef = useRef(null);

  const vibe = useCallback((pattern) => {
    if (!settings.haptics) return;
    try {
      if (!hapticsRef.current) {
        hapticsRef.current = new WebHaptics();
      }
      // Map numeric vibe patterns to high-end WebHaptics presets
      if (pattern === 8) {
        hapticsRef.current.trigger("selection"); // Crisp selection haptic for standard counting clicks (very low click haptic)
      } else if (pattern === 5 || pattern === 6) {
        hapticsRef.current.trigger("soft"); // Padded soft impact for undo / navigation clicks
      } else if (Array.isArray(pattern) && pattern.includes(38)) {
        hapticsRef.current.trigger("success"); // Premium success haptic burst for target reached
      } else {
        hapticsRef.current.trigger(pattern);
      }
    } catch (e) {
      console.warn("Haptics trigger failed:", e);
      // Fallback to standard vibration if web-haptics fails
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    }
  }, [settings.haptics]);

  const setTargetEdit = useCallback((newTargetEdit) => {
    setTargetEditInternal(newTargetEdit);
    vibe(8);
  }, [vibe]);

  const setSettings = useCallback((newSettingsVal) => {
    setSettingsInternal((prev) => {
      const next = typeof newSettingsVal === "function" ? newSettingsVal(prev) : newSettingsVal;
      // Triggers click feedback vibration when changing settings
      if (prev.haptics || next.haptics) {
        try {
          if (!hapticsRef.current) {
            hapticsRef.current = new WebHaptics();
          }
          hapticsRef.current.trigger("selection");
        } catch (e) {
          if (navigator.vibrate) {
            navigator.vibrate(8);
          }
        }
      }
      return next;
    });
  }, []);

  const click = useCallback(() => {
    if (!settings.sound) return;
    try {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioRef.current;
      // Resume if context was suspended (browser security)
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      o.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio synthesis failed:", e);
    }
  }, [settings.sound]);


  /* Session controls */
  const openSession = useCallback((steps, title, occasion, sourceListId = null, navOpts) => {
    setSession({
      title,
      occasion,
      sourceListId,
      steps,
      counts: steps.map(() => 0),
      loops: steps.map(() => 0),
      stepIndex: 0
    });
    setComplete(false);
    setView("counter", navOpts);
  }, [setView]);

  const startList = useCallback((list, navOpts) => {
    openSession(list.steps.map((s) => ({ ...s })), list.name, list.occasion, list.id, navOpts);
  }, [openSession]);

  const startDhikr = useCallback((d, navOpts) => {
    openSession([{ dhikr: d.id, target: d.target }], d.tr, "general", null, navOpts);
  }, [openSession]);

  /* Deep-link query parameter scanner — handles notification deep links like /counter?dhikr=ID */
  useEffect(() => {
    if (!loaded) return;
    const dhikrParam = searchParams.get("dhikr");
    const listParam = searchParams.get("list");
    if (dhikrParam) {
      const d = dhikrs.find((x) => x.id === dhikrParam);
      if (d) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("dhikr");
            return next;
          },
          { replace: true }
        );
        startDhikr(d);
      }
    } else if (listParam) {
      const l = lists.find((x) => x.id === listParam);
      if (l) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("list");
            return next;
          },
          { replace: true }
        );
        startList(l);
      }
    }
  }, [loaded, searchParams, dhikrs, lists, startDhikr, startList, setSearchParams]);

  const increment = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    const i = s.stepIndex;
    const step = s.steps[i];
    if (!step) return;

    const dId = step.dhikr;
    const nextCount = s.counts[i] + 1;
    const reached = nextCount === step.target;

    // Advance the mirror first, so a burst of increments within one gesture
    // each build on the last, then enqueue a pure state update.
    const counts = [...s.counts];
    counts[i] = nextCount;
    sessionRef.current = { ...s, counts };

    setSession((cur) => {
      if (!cur) return cur;
      const next = [...cur.counts];
      next[cur.stepIndex] += 1;
      return { ...cur, counts: next };
    });

    setStats((st) => {
      const k = dateKey();
      return {
        ...st,
        total: st.total + 1,
        byDate: { ...st.byDate, [k]: (st.byDate[k] || 0) + 1 },
        perDhikr: { ...st.perDhikr, [dId]: (st.perDhikr[dId] || 0) + 1 }
      };
    });

    if (reached) {
      vibe([0, 38, 28, 38]);
      click();

      // A finished set (every step) or round of a single dhikr, once per round.
      const key = s.sourceListId || (s.steps.length === 1 ? s.steps[0].dhikr : null);
      const finished = s.steps.every((st, j) => counts[j] >= st.target);
      if (key && finished && s.recordedLoop !== s.loops[i]) {
        sessionRef.current = { ...sessionRef.current, recordedLoop: s.loops[i] };
        setSession((cur) => cur && { ...cur, recordedLoop: s.loops[i] });
        setStats((st) => {
          const d = st.completed || {};
          return { ...st, completed: { ...d, [key]: { n: (d[key]?.n || 0) + 1, last: Date.now() } } };
        });
      }

      if (s.steps.length > 1 && i < s.steps.length - 1 && settings.autoAdvance) {
        setTimeout(() => {
          setSession((cur) => {
            if (!cur) return cur;
            const nextIndex = cur.stepIndex + 1;
            if (nextIndex >= cur.steps.length) return cur; // Boundary guard
            return { ...cur, stepIndex: nextIndex };
          });
        }, 420);
      } else if (s.steps.length === 1 && settings.loop) {
        setTimeout(() => {
          setSession((cur) => {
            if (!cur) return cur;
            const c = [...cur.counts];
            const l = [...cur.loops];
            l[0] += 1;
            c[0] = 0;
            return { ...cur, counts: c, loops: l };
          });
        }, 420);
      } else if (i === s.steps.length - 1) {
        setTimeout(() => setComplete(true), 250);
      }
    } else {
      vibe(8);
      click();
    }

  }, [settings.autoAdvance, settings.loop, vibe, click]);

  const decrement = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    const i = s.stepIndex;
    const step = s.steps[i];
    if (!step || s.counts[i] <= 0) return;

    const dId = step.dhikr;
    const counts = [...s.counts];
    counts[i] -= 1;
    sessionRef.current = { ...s, counts };

    setSession((cur) => {
      if (!cur || cur.counts[cur.stepIndex] <= 0) return cur;
      const next = [...cur.counts];
      next[cur.stepIndex] -= 1;
      return { ...cur, counts: next };
    });

    setStats((st) => {
      const k = dateKey();
      return {
        ...st,
        total: Math.max(0, st.total - 1),
        byDate: { ...st.byDate, [k]: Math.max(0, (st.byDate[k] || 0) - 1) },
        perDhikr: { ...st.perDhikr, [dId]: Math.max(0, (st.perDhikr[dId] || 0) - 1) }
      };
    });

    vibe(8);
  }, [vibe]);

  const resetSession = useCallback(() => {
    setSession((s) => {
      if (!s) return s;
      return {
        ...s,
        counts: s.counts.map(() => 0),
        loops: s.loops.map(() => 0),
        stepIndex: 0,
        recordedLoop: undefined
      };
    });
    vibe(8);
  }, [vibe]);

  const goStep = useCallback((dir) => {
    const s = sessionRef.current;
    if (!s) return;
    const nextIndex = Math.min(Math.max(s.stepIndex + dir, 0), s.steps.length - 1);
    if (nextIndex !== s.stepIndex) {
      sessionRef.current = { ...s, stepIndex: nextIndex };
      setSession((cur) => (cur ? { ...cur, stepIndex: nextIndex } : cur));
      vibe(8);
    }
    setComplete(false);
  }, [vibe]);

  const applyTarget = useCallback((val) => {
    const v = Math.max(1, Math.round(Number(val) || 0));
    if (!v) return;
    setSession((s) => {
      if (!s) return s;
      const steps = s.steps.map((st, idx) => idx === s.stepIndex ? { ...st, target: v } : st);
      return { ...s, steps };
    });
    setTargetEdit(false);
    setCustomT("");
    vibe(8);
  }, [vibe]);

  const togglePin = useCallback((id) => {
    setPinned((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
    vibe(8);
  }, [vibe]);

  /* ─── PWA: install prompt + update lifecycle ───────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };
    const onUpdate = (e) => {
      swRegistrationRef.current = e.detail?.registration || null;
      setUpdateAvailable(true);
    };
    const onDisplayModeChange = (e) => setIsInstalled(e.matches);
    const standaloneMql = window.matchMedia?.("(display-mode: standalone)");

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("sw-update-available", onUpdate);
    standaloneMql?.addEventListener?.("change", onDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("sw-update-available", onUpdate);
      standaloneMql?.removeEventListener?.("change", onDisplayModeChange);
    };
  }, []);

  // Runtime version check — polls /version.json so we catch new releases even
  // when the SW updatefound event doesn't fire (iOS standalone, long-lived tabs).
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Vite injects the real version in dev too, while public/version.json says
    // 0.0.0-dev, so without this the banner would show permanently in dev.
    if (import.meta.env.DEV || APP_VERSION === "0.0.0-dev") return;

    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const { version } = await res.json();
        if (cancelled || !version) return;
        if (version !== APP_VERSION) {
          setUpdateAvailable(true);
          // Nudge the SW too so its waiting worker is ready when the user reloads.
          navigator.serviceWorker?.getRegistration?.().then((reg) => reg?.update?.()).catch(() => {});
        }
      } catch (_) {
        // network errors are silent — we'll retry on the next tick
      }
    };

    check();
    const onFocus = () => check();
    const onVisibility = () => { if (document.visibilityState === "visible") check(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    const id = setInterval(check, 30 * 60 * 1000); // every 30 minutes

    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;
    try {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      return choice?.outcome === "accepted";
    } catch (e) {
      console.warn("Install prompt failed:", e);
      return false;
    }
  }, [installPrompt]);

  /* Resolve once the registration has a waiting worker, or give up after
     `ms`. An update found by the version poll may still be downloading. */
  const waitForWaiting = (reg, ms = 10000) =>
    new Promise((resolve) => {
      if (reg.waiting) return resolve(reg.waiting);
      const done = () => {
        clearTimeout(timer);
        resolve(reg.waiting || null);
      };
      const timer = setTimeout(done, ms);
      const watch = (w) => w && w.addEventListener("statechange", () => w.state === "installed" && done());
      watch(reg.installing);
      reg.addEventListener("updatefound", () => watch(reg.installing), { once: true });
    });

  const applyUpdate = useCallback(async () => {
    flushRef.current?.();
    // main.jsx reloads on controllerchange only when this flag is set.
    window.__tgUpdateRequested = true;
    try {
      const reg = swRegistrationRef.current || (await navigator.serviceWorker?.getRegistration?.());
      if (reg) {
        if (!reg.waiting) {
          await reg.update().catch(() => {});
          await waitForWaiting(reg);
        }
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
          // Fallback in case controllerchange never arrives.
          setTimeout(() => window.location.reload(), 4000);
          return;
        }
      }
    } catch (e) {
      console.warn("Applying update failed:", e);
    }
    window.location.reload();
  }, []);

  /* Settings > Check for updates. Returns true when a newer version is ready
     to apply (it is then announced the same way as an automatic find). */
  const checkForUpdates = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return false;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return false;
      await reg.update();
      const waiting = reg.installing ? await waitForWaiting(reg) : reg.waiting;
      if (waiting && navigator.serviceWorker.controller) {
        swRegistrationRef.current = reg;
        setUpdateAvailable(true);
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Update check failed:", e);
      return false;
    }
  }, []);

  /* Merge fresh SEED data with user-created customs — same logic as the
     load-time migration in this file. Resets storage_version so caches/SW
     stay coherent. */
  const resyncLibrary = useCallback(() => {
    const customDhikrs = dhikrs.filter(
      (d) => d.id.startsWith("c_") || d.tags?.includes("custom")
    );
    const customLists = lists.filter((l) => l.id.startsWith("c_"));

    const nextDhikrs = [...SEED_DHIKRS, ...SEED_NAMES_OF_ALLAH, ...customDhikrs];
    const nextLists = [...SEED_LISTS, ...customLists];

    setDhikrs(nextDhikrs);
    setLists(nextLists);
    setPinned((p) => p.filter((id) =>
      nextDhikrs.some((d) => d.id === id) || nextLists.some((l) => l.id === id)
    ));
    store.set("dhikrs", nextDhikrs);
    store.set("lists", nextLists);
    store.set("storage_version", STORAGE_VERSION);
    return { dhikrs: nextDhikrs.length, lists: nextLists.length };
  }, [dhikrs, lists]);

  /* ─── Library management ───────────────────────────────────────────────
     Custom items carry a "c_" id. Built-in items are never edited in place:
     a built-in set is customised by duplicating it. Every delete returns an
     undo function, so the UI can offer Undo instead of a blocking confirm. */
  const isCustomId = (id) => typeof id === "string" && id.startsWith("c_");
  const newId = () => `c_${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const createDhikr = useCallback((data) => {
    const id = newId();
    const tags = Array.from(new Set(["custom", ...(data.tags || []).filter(Boolean), "general"]));
    setDhikrs((ds) => [
      ...ds,
      {
        tr: data.tr.trim(),
        arabic: data.arabic.trim(),
        en: (data.en || "").trim(),
        ur: (data.ur || "").trim(),
        target: Math.max(1, Math.round(Number(data.target) || 33)),
        tags,
        id,
      },
    ]);
    return id;
  }, []);

  const updateDhikr = useCallback((id, patch) => {
    setDhikrs((ds) =>
      ds.map((d) =>
        d.id === id
          ? {
              ...d,
              ...patch,
              target: patch.target != null ? Math.max(1, Math.round(Number(patch.target) || d.target)) : d.target,
            }
          : d
      )
    );
  }, []);

  const deleteDhikr = useCallback(
    (id) => {
      const index = dhikrs.findIndex((d) => d.id === id);
      if (index < 0 || !isCustomId(id)) return null;
      const item = dhikrs[index];
      const pinIndex = pinned.indexOf(id);
      const affected = lists
        .filter((l) => l.steps.some((s) => s.dhikr === id))
        .map((l) => ({ id: l.id, steps: l.steps }));

      setDhikrs((ds) => ds.filter((d) => d.id !== id));
      setPinned((p) => p.filter((x) => x !== id));
      if (affected.length) {
        setLists((ls) =>
          ls.map((l) =>
            affected.some((a) => a.id === l.id) ? { ...l, steps: l.steps.filter((s) => s.dhikr !== id) } : l
          )
        );
      }

      return () => {
        setDhikrs((ds) => (ds.some((d) => d.id === id) ? ds : [...ds.slice(0, index), item, ...ds.slice(index)]));
        if (pinIndex >= 0) {
          setPinned((p) => (p.includes(id) ? p : [...p.slice(0, pinIndex), id, ...p.slice(pinIndex)]));
        }
        if (affected.length) {
          setLists((ls) =>
            ls.map((l) => {
              const a = affected.find((x) => x.id === l.id);
              return a ? { ...l, steps: a.steps } : l;
            })
          );
        }
      };
    },
    [dhikrs, lists, pinned]
  );

  const createList = useCallback((data) => {
    const id = newId();
    setLists((ls) => [
      ...ls,
      {
        name: data.name.trim(),
        occasion: data.occasion || "custom",
        icon: data.icon || "sparkles",
        steps: data.steps.map((s) => ({ dhikr: s.dhikr, target: Math.max(1, Math.round(Number(s.target) || 33)) })),
        id,
      },
    ]);
    return id;
  }, []);

  const updateList = useCallback((id, patch) => {
    setLists((ls) =>
      ls.map((l) =>
        l.id === id
          ? {
              ...l,
              ...patch,
              steps: patch.steps
                ? patch.steps.map((s) => ({ dhikr: s.dhikr, target: Math.max(1, Math.round(Number(s.target) || 33)) }))
                : l.steps,
            }
          : l
      )
    );
  }, []);

  const deleteList = useCallback(
    (id) => {
      const index = lists.findIndex((l) => l.id === id);
      if (index < 0 || !isCustomId(id)) return null;
      const item = lists[index];
      const pinIndex = pinned.indexOf(id);
      setLists((ls) => ls.filter((l) => l.id !== id));
      setPinned((p) => p.filter((x) => x !== id));
      return () => {
        setLists((ls) => (ls.some((l) => l.id === id) ? ls : [...ls.slice(0, index), item, ...ls.slice(index)]));
        if (pinIndex >= 0) {
          setPinned((p) => (p.includes(id) ? p : [...p.slice(0, pinIndex), id, ...p.slice(pinIndex)]));
        }
      };
    },
    [lists, pinned]
  );

  /* Copy any set (usually a built-in one) into an editable custom set. */
  const duplicateList = useCallback(
    (id) => {
      const src = lists.find((l) => l.id === id);
      if (!src) return null;
      return createList({
        name: isCustomId(id) ? `${src.name} (copy)` : `${src.name} (mine)`,
        occasion: src.occasion === "custom" ? "custom" : src.occasion,
        icon: src.icon,
        steps: src.steps,
      });
    },
    [lists, createList]
  );

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    setNotifyPermission(permission);
    return permission === "granted";
  }, []);

  /* ─── Prayer times ──────────────────────────────────────────────────────
     Acquire the device location once and persist the coordinates into
     settings so subsequent loads compute times without re-prompting. */
  const requestPrayerLocation = useCallback(async () => {
    const { lat, lng } = await getCurrentPosition();
    const label = timezoneCity();
    setSettings((s) => ({
      ...s,
      prayer: {
        ...s.prayer,
        location: { mode: "auto", lat, lng, label },
      },
    }));
    return { lat, lng, label };
  }, []);

  /* Notifications are "active" if either the manual daily reminders or the
     prayer-time reminders are switched on. */
  const prayerRemindersOn =
    !!settings.prayer?.enabled && !!settings.prayer?.reminders?.enabled;
  const notificationsActive = !!settings.alertsEnabled || prayerRemindersOn;

  /* Regenerate prayer-time alerts whenever the prayer config changes, then
     again at the next midnight and on app focus (prayer times are date- and
     location-dependent, so a long-lived tab must refresh them). */
  useEffect(() => {
    if (!loaded) return;
    const p = settings.prayer;
    const loc = p?.location;
    const ready =
      prayerRemindersOn && loc && loc.lat != null && loc.lng != null;
    if (!ready) {
      setPrayerAlerts([]);
      return;
    }

    const recompute = () => {
      try {
        const schedule = prayerSchedule({
          lat: loc.lat,
          lng: loc.lng,
          method: p.method,
          madhhab: p.madhhab,
          highLatRule: p.highLatRule,
          offsets: p.offsets,
        });
        setPrayerAlerts(buildPrayerAlerts(p, schedule));
      } catch (e) {
        console.warn("Prayer alert build failed:", e);
        setPrayerAlerts([]);
      }
    };

    recompute();

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 5, 0); // a few seconds past midnight
    const midnightTimer = setTimeout(recompute, nextMidnight.getTime() - now.getTime());
    const onVisible = () => {
      if (document.visibilityState === "visible") recompute();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", recompute);
    return () => {
      clearTimeout(midnightTimer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", recompute);
    };
  }, [loaded, settings.prayer, prayerRemindersOn]);

  /* Manual daily reminders + computed prayer reminders, fired through one
     pipeline (foreground loop + service worker). */
  const effectiveAlerts = useMemo(
    () => [...(settings.alerts || []), ...prayerAlerts],
    [settings.alerts, prayerAlerts]
  );

  /* Auto-request notification permission when reminders are enabled */
  useEffect(() => {
    if (!loaded || !notificationsActive) return;
    if (notifyPermission === "default" && "Notification" in window) {
      // Small delay so it doesn't fire instantly on first render
      const timer = setTimeout(() => {
        Notification.requestPermission().then((perm) => {
          setNotifyPermission(perm);
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loaded, notificationsActive, notifyPermission]);

  /* Sync alert configs to service worker for background scheduling */
  const syncAlertsToSW = useCallback(() => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) return;
    navigator.serviceWorker.controller.postMessage({
      type: "SYNC_ALERTS",
      alerts: effectiveAlerts,
      enabled: notificationsActive
    });
  }, [effectiveAlerts, notificationsActive]);

  useEffect(() => {
    if (!loaded) return;
    syncAlertsToSW();
    // Also sync when SW becomes active (e.g. after first install)
    const onControllerChange = () => syncAlertsToSW();
    navigator.serviceWorker?.addEventListener("controllerchange", onControllerChange);
    return () => navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
  }, [loaded, syncAlertsToSW]);

  /* Register periodic background sync (Android Chrome) */
  useEffect(() => {
    if (!loaded || !notificationsActive || notifyPermission !== "granted") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.ready.then(async (reg) => {
      if ("periodicSync" in reg) {
        try {
          const status = await navigator.permissions.query({ name: "periodic-background-sync" });
          if (status.state === "granted") {
            await reg.periodicSync.register("sabha-alert-check", {
              minInterval: 15 * 60 * 1000 // 15 minutes minimum
            });
          }
        } catch (e) {
          // periodicSync not supported or denied — foreground fallback handles this
        }
      }
    });
  }, [loaded, notificationsActive, notifyPermission]);

  const triggerNotification = useCallback((title, body, alertId, url = "/") => {
    try {
      if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: "/icon-192.png",
            vibrate: [200, 100, 200],
            badge: "/favicon-64.png",
            tag: `sabha-${alertId || "reminder"}`,
            data: { url },
            actions: [
              { action: "open", title: "Begin" },
              { action: "dismiss", title: "Later" }
            ]
          });
        });
      } else {
        const n = new Notification(title, { body, icon: "/icon-192.png" });
        n.onclick = () => {
          window.focus();
          if (url) {
            window.location.href = url;
          }
        };
      }
    } catch (e) {
      console.warn("Notification display failed:", e);
    }
  }, []);

  /* Foreground notification check loop + visibility-change handler */
  useEffect(() => {
    if (notifyPermission !== "granted" || !notificationsActive) return;

    const checkAlerts = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const timeStr = `${h}:${m}`;
      const today = dateKey();

      effectiveAlerts.forEach((alert) => {
        if (alert.enabled && alert.time === timeStr) {
          const firedKey = `fired_${alert.id}`;
          const lastFired = store.get(firedKey, "");
          if (lastFired !== today) {
            let deepLink = "/";
            if (alert.targetType === "dhikr" && alert.targetId) {
              deepLink = `/counter?dhikr=${alert.targetId}`;
            } else if (alert.targetType === "list" && alert.targetId) {
              deepLink = `/counter?list=${alert.targetId}`;
            }
            triggerNotification(
              alert.title, 
              alert.body || "It's time for your dhikr recitations.",
              alert.id,
              deepLink
            );
            store.set(firedKey, today);
          }
        }
      });
    };

    // Check immediately on mount / re-enable
    checkAlerts();

    // Check every 15 seconds
    const interval = setInterval(checkAlerts, 15000);

    // Also check when user returns to the app (visibility change)
    const onVisChange = () => {
      if (document.visibilityState === "visible") {
        checkAlerts();
      }
    };
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [notifyPermission, effectiveAlerts, notificationsActive, triggerNotification]);
  const startNamesSession = useCallback((index) => {
    setNamesSession((prev) => ({ ...prev, index }));
    setView("names");
  }, [setView]);

  const incrementName = useCallback(() => {
    const prev = namesSessionRef.current;
    const i = prev.index;
    const activeName = SEED_NAMES_OF_ALLAH[i];
    if (!activeName) return;

    const nextCount = prev.counts[i] + 1;
    const counts = [...prev.counts];
    counts[i] = nextCount;
    namesSessionRef.current = { ...prev, counts };

    setNamesSession((cur) => {
      const next = [...cur.counts];
      next[cur.index] += 1;
      return { ...cur, counts: next };
    });

    setStats((st) => {
      const k = dateKey();
      return {
        ...st,
        total: st.total + 1,
        byDate: { ...st.byDate, [k]: (st.byDate[k] || 0) + 1 },
        perDhikr: { ...st.perDhikr, [activeName.id]: (st.perDhikr[activeName.id] || 0) + 1 }
      };
    });

    if (nextCount === prev.targets[i]) {
      vibe([0, 38, 28, 38]);
      click();
    } else {
      vibe(8);
      click();
    }

  }, [vibe, click]);

  const decrementName = useCallback(() => {
    const prev = namesSessionRef.current;
    const i = prev.index;
    const activeName = SEED_NAMES_OF_ALLAH[i];
    if (!activeName || prev.counts[i] <= 0) return;

    const counts = [...prev.counts];
    counts[i] -= 1;
    namesSessionRef.current = { ...prev, counts };

    setNamesSession((cur) => {
      if (cur.counts[cur.index] <= 0) return cur;
      const next = [...cur.counts];
      next[cur.index] -= 1;
      return { ...cur, counts: next };
    });

    setStats((st) => {
      const k = dateKey();
      return {
        ...st,
        total: Math.max(0, st.total - 1),
        byDate: { ...st.byDate, [k]: Math.max(0, (st.byDate[k] || 0) - 1) },
        perDhikr: { ...st.perDhikr, [activeName.id]: Math.max(0, (st.perDhikr[activeName.id] || 0) - 1) }
      };
    });

    vibe(8);
  }, [vibe]);

  const resetName = useCallback(() => {
    setNamesSession((prev) => {
      const counts = [...prev.counts];
      const i = prev.index;
      counts[i] = 0;
      return { ...prev, counts };
    });
    vibe(8);
  }, [vibe]);

  const navigateNames = useCallback((dir) => {
    setNamesSession((prev) => {
      const nextIndex = Math.min(Math.max(prev.index + dir, 0), 98);
      if (nextIndex !== prev.index) {
        vibe(8);
      }
      return { ...prev, index: nextIndex };
    });
  }, [vibe]);

  const applyNameTarget = useCallback((val) => {
    const v = Math.max(1, Math.round(Number(val) || 0));
    if (!v) return;
    setNamesSession((prev) => {
      const targets = [...prev.targets];
      targets[prev.index] = v;
      return { ...prev, targets };
    });
    setTargetEdit(false);
    setCustomT("");
    vibe(8);
  }, [vibe]);

  const cleanUpApp = useCallback(async () => {
    // 1. Unregister service workers
    if ("serviceWorker" in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      } catch (e) {
        console.warn("SW unregistration failed:", e);
      }
    }

    // 2. Clear Cache Storage
    if ("caches" in window) {
      try {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      } catch (e) {
        console.warn("Cache deletion failed:", e);
      }
    }

    // 3. Clear other local storage keys, but KEEP "stats" and custom items
    const currentStats = store.get("stats", { total: 0, byDate: {}, perDhikr: {} });
    const customDhikrs = dhikrs.filter((d) => d.id.startsWith("c_") || d.tags?.includes("custom"));
    const customLists = lists.filter((l) => l.id.startsWith("c_"));
    
    const nextDhikrs = [...SEED_DHIKRS, ...SEED_NAMES_OF_ALLAH, ...customDhikrs];
    const nextLists = [...SEED_LISTS, ...customLists];
    
    setDhikrs(nextDhikrs);
    setLists(nextLists);
    setPinned(["after-salah", "istighfar-100", "durood-100"]);
    setSettingsInternal(DEFAULT_SETTINGS);
    setSession(null);
    setComplete(false);
    setNamesSession({
      index: 0,
      counts: Array(99).fill(0),
      targets: Array(99).fill(100)
    });
    
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }
    
    store.set("stats", currentStats);
    store.set("dhikrs", nextDhikrs);
    store.set("lists", nextLists);
    store.set("pinned", ["after-salah", "istighfar-100", "durood-100"]);
    store.set("settings", DEFAULT_SETTINGS);
    store.set("storage_version", STORAGE_VERSION);
    
    window.location.reload();
  }, [dhikrs, lists]);

  /* ─── Backup & Restore ─────────────────────────────────────────────────
     Export reads straight from storage so the download is consistent even
     mid-session. The debounced save effect flushes pending React state to
     storage on a 700ms timer, so a fresh count could lag — flush synchronously
     first to guarantee the export captures the very latest state. */
  const exportData = useCallback(() => {
    store.set("dhikrs", dhikrs);
    store.set("lists", lists);
    store.set("pinned", pinned);
    store.set("stats", stats);
    store.set("settings", settings);
    store.set("session", session);
    store.set("complete", complete);
    store.set("names_session", namesSession);
    return downloadBackup(APP_VERSION);
  }, [dhikrs, lists, pinned, stats, settings, session, complete, namesSession]);

  /* Restore a parsed backup's inner `data` object. We rebuild the library by
     merging the *current* SEED data with the backup's custom items (same logic
     as resync / load-time migration). This keeps built-in dhikrs current while
     faithfully restoring everything the user owns — stats, settings, pins, and
     even an in-progress session — so they can continue exactly where they were.
     State and storage are both written so the restore survives a reload. */
  const importData = useCallback((data) => {
    if (!data || typeof data !== "object") {
      throw new Error("Nothing to restore.");
    }

    const importedDhikrs = Array.isArray(data.dhikrs) ? data.dhikrs : [];
    const importedLists = Array.isArray(data.lists) ? data.lists : [];

    const customDhikrs = importedDhikrs.filter(
      (d) => d?.id && (d.id.startsWith("c_") || d.tags?.includes("custom"))
    );
    const customLists = importedLists.filter((l) => l?.id && l.id.startsWith("c_"));

    const nextDhikrs = [...SEED_DHIKRS, ...SEED_NAMES_OF_ALLAH, ...customDhikrs];
    const nextLists = [...SEED_LISTS, ...customLists];

    const nextSettings =
      data.settings && typeof data.settings === "object"
        ? {
            ...DEFAULT_SETTINGS,
            ...data.settings,
            prayer: {
              ...DEFAULT_SETTINGS.prayer,
              ...(data.settings.prayer || {}),
              location: { ...DEFAULT_SETTINGS.prayer.location, ...(data.settings.prayer?.location || {}) },
              offsets: { ...DEFAULT_SETTINGS.prayer.offsets, ...(data.settings.prayer?.offsets || {}) },
              reminders: {
                ...DEFAULT_SETTINGS.prayer.reminders,
                ...(data.settings.prayer?.reminders || {}),
                prayers: {
                  ...DEFAULT_SETTINGS.prayer.reminders.prayers,
                  ...(data.settings.prayer?.reminders?.prayers || {}),
                },
              },
            },
          }
        : DEFAULT_SETTINGS;
    const nextStats =
      data.stats && typeof data.stats === "object"
        ? { total: 0, byDate: {}, perDhikr: {}, ...data.stats }
        : { total: 0, byDate: {}, perDhikr: {} };
    const nextPinned = Array.isArray(data.pinned)
      ? data.pinned.filter(
          (id) => nextDhikrs.some((d) => d.id === id) || nextLists.some((l) => l.id === id)
        )
      : ["after-salah", "istighfar-100", "durood-100"];
    const nextNames =
      data.names_session && Array.isArray(data.names_session.counts)
        ? data.names_session
        : { index: 0, counts: Array(99).fill(0), targets: Array(99).fill(100) };
    const nextSession = data.session ?? null;
    const nextComplete = !!data.complete;

    setDhikrs(nextDhikrs);
    setLists(nextLists);
    setPinned(nextPinned);
    setStats(nextStats);
    setSettingsInternal(nextSettings);
    setNamesSession(nextNames);
    setSession(nextSession);
    setComplete(nextComplete);

    store.set("dhikrs", nextDhikrs);
    store.set("lists", nextLists);
    store.set("pinned", nextPinned);
    store.set("stats", nextStats);
    store.set("settings", nextSettings);
    store.set("names_session", nextNames);
    store.set("session", nextSession);
    store.set("complete", nextComplete);
    store.set("storage_version", STORAGE_VERSION);

    return {
      dhikrs: nextDhikrs.length,
      lists: nextLists.length,
      total: nextStats.total || 0,
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        loaded,
        view,
        setView,
        dhikrs,
        setDhikrs,
        lists,
        setLists,
        pinned,
        setPinned,
        stats,
        setStats,
        settings,
        setSettings,
        session,
        setSession,
        modal,
        setModal,
        editId,
        openEditor,
        complete,
        setComplete,
        targetEdit,
        setTargetEdit,
        customT,
        setCustomT,
        activeOccasion,
        setActiveOccasion,
        searchQuery,
        setSearchQuery,
        dById,
        vibe,
        click,
        openSession,
        startList,
        startDhikr,
        increment,
        decrement,
        resetSession,
        goStep,
        applyTarget,
        togglePin,
        createDhikr,
        updateDhikr,
        deleteDhikr,
        createList,
        updateList,
        deleteList,
        duplicateList,
        notifyPermission,
        requestNotificationPermission,
        requestPrayerLocation,
        appVersion: APP_VERSION,
        updateAvailable,
        applyUpdate,
        checkForUpdates,
        installPrompt,
        promptInstall,
        isInstalled,
        resyncLibrary,
        namesSession,
        setNamesSession,
        startNamesSession,
        incrementName,
        decrementName,
        resetName,
        navigateNames,
        applyNameTarget,
        cleanUpApp,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
