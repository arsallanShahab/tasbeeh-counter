import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SEED_DHIKRS, SEED_LISTS, DEFAULT_SETTINGS, STORAGE_VERSION } from "../constants/dhikrData";
import { store } from "../utils/storage";
import { dateKey } from "../utils/stats";
import { WebHaptics } from "web-haptics";

const AppContext = createContext(null);

const VALID_VIEWS = ["home", "library", "stats", "settings", "counter"];

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
  const modal = searchParams.get("modal") || null;
  const activeOccasion = searchParams.get("occasion") || "all";

  const [loaded, setLoaded] = useState(false);
  const [dhikrs, setDhikrs] = useState(SEED_DHIKRS);
  const [lists, setLists] = useState(SEED_LISTS);
  const [pinned, setPinned] = useState(["after-salah", "istighfar-100", "durood-100"]);
  const [stats, setStats] = useState({ total: 0, byDate: {}, perDhikr: {} });
  const [settings, setSettingsInternal] = useState(DEFAULT_SETTINGS);

  const [session, setSession] = useState(null);
  const [bump, setBump] = useState(false);
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

  // Router-based navigation helpers (replace legacy hash-routing)
  const setView = useCallback(
    (newView) => {
      navigate(viewToPath(newView));
    },
    [navigate]
  );

  const setModal = useCallback(
    (newModal) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newModal) next.set("modal", newModal);
          else next.delete("modal");
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

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
        
        // 2. Overwrite defaults with new SEED_DHIKRS & SEED_LISTS, appending custom items
        loadedDhikrs = [...SEED_DHIKRS, ...customDhikrs];
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
      
      setSettingsInternal({ ...DEFAULT_SETTINGS, ...loadedSettings });
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
    }, 700);
    return () => clearTimeout(saveTimer.current);
  }, [dhikrs, lists, pinned, stats, settings, session, complete, loaded]);

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

  const bumpNum = () => {
    setBump(true);
    setTimeout(() => setBump(false), 130);
  };

  /* Session controls */
  const openSession = useCallback((steps, title, occasion, sourceListId = null) => {
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
    setView("counter");
  }, [setView]);

  const startList = useCallback((list) => {
    openSession(list.steps.map((s) => ({ ...s })), list.name, list.occasion, list.id);
  }, [openSession]);

  const startDhikr = useCallback((d) => {
    openSession([{ dhikr: d.id, target: d.target }], d.tr, "general");
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
    if (!session) return;
    setSession((s) => {
      const i = s.stepIndex;
      const counts = [...s.counts];
      const loops = [...s.loops];
      const target = s.steps[i].target;
      const reached = counts[i] + 1 >= target;
      
      counts[i] += 1;
      const dId = s.steps[i].dhikr;

      // Stats update
      setStats((st) => {
        const k = dateKey();
        return {
          total: st.total + 1,
          byDate: { ...st.byDate, [k]: (st.byDate[k] || 0) + 1 },
          perDhikr: { ...st.perDhikr, [dId]: (st.perDhikr[dId] || 0) + 1 }
        };
      });

      if (reached && counts[i] === target) {
        vibe([0, 38, 28, 38]);
        click();
        
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
      
      bumpNum();
      return { ...s, counts, loops };
    });
  }, [session, settings.autoAdvance, settings.loop, vibe, click]);

  const decrement = useCallback(() => {
    if (!session) return;
    setSession((s) => {
      const i = s.stepIndex;
      if (s.counts[i] <= 0) return s;
      
      const counts = [...s.counts];
      counts[i] -= 1;
      const dId = s.steps[i].dhikr;

      setStats((st) => {
        const k = dateKey();
        return {
          total: Math.max(0, st.total - 1),
          byDate: { ...st.byDate, [k]: Math.max(0, (st.byDate[k] || 0) - 1) },
          perDhikr: { ...st.perDhikr, [dId]: Math.max(0, (st.perDhikr[dId] || 0) - 1) }
        };
      });

      vibe(8);
      return { ...s, counts };
    });
  }, [session, vibe]);

  const resetSession = useCallback(() => {
    setSession((s) => {
      if (!s) return s;
      return {
        ...s,
        counts: s.counts.map(() => 0),
        loops: s.loops.map(() => 0),
        stepIndex: 0
      };
    });
    vibe(8);
  }, [vibe]);

  const goStep = useCallback((dir) => {
    setSession((s) => {
      if (!s) return s;
      const nextIndex = Math.min(Math.max(s.stepIndex + dir, 0), s.steps.length - 1);
      if (nextIndex !== s.stepIndex) {
        vibe(8);
      }
      setComplete(false);
      return { ...s, stepIndex: nextIndex };
    });
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

  const saveDhikr = useCallback((nd, setNd) => {
    if (!nd.tr.trim() || !nd.arabic.trim()) return;
    const id = "c_" + Date.now();
    setDhikrs((ds) => [...ds, { ...nd, id, target: Number(nd.target) || 33, tags: ["custom", "general"] }]);
    setNd({ tr: "", arabic: "", en: "", ur: "", target: 33 });
    setModal(null);
  }, [setModal]);

  const saveList = useCallback((nl, setNl) => {
    if (!nl.name.trim() || nl.steps.length === 0) return;
    setLists((ls) => [...ls, { ...nl, id: "c_" + Date.now() }]);
    setNl({ name: "", occasion: "custom", icon: "sparkles", steps: [] });
    setModal(null);
  }, [setModal]);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    setNotifyPermission(permission);
    return permission === "granted";
  }, []);

  /* Auto-request notification permission when alerts are enabled */
  useEffect(() => {
    if (!loaded || !settings.alertsEnabled) return;
    if (notifyPermission === "default" && "Notification" in window) {
      // Small delay so it doesn't fire instantly on first render
      const timer = setTimeout(() => {
        Notification.requestPermission().then((perm) => {
          setNotifyPermission(perm);
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loaded, settings.alertsEnabled, notifyPermission]);

  /* Sync alert configs to service worker for background scheduling */
  const syncAlertsToSW = useCallback(() => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) return;
    navigator.serviceWorker.controller.postMessage({
      type: "SYNC_ALERTS",
      alerts: settings.alerts || [],
      enabled: !!settings.alertsEnabled
    });
  }, [settings.alerts, settings.alertsEnabled]);

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
    if (!loaded || !settings.alertsEnabled || notifyPermission !== "granted") return;
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
  }, [loaded, settings.alertsEnabled, notifyPermission]);

  const triggerNotification = useCallback((title, body, alertId, url = "/") => {
    try {
      if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: "/favicon.svg",
            vibrate: [200, 100, 200],
            badge: "/favicon.svg",
            tag: `sabha-${alertId || "reminder"}`,
            data: { url },
            actions: [
              { action: "open", title: "Begin" },
              { action: "dismiss", title: "Later" }
            ]
          });
        });
      } else {
        const n = new Notification(title, { body, icon: "/favicon.svg" });
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
    if (notifyPermission !== "granted" || !settings.alertsEnabled || !settings.alerts) return;

    const checkAlerts = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const timeStr = `${h}:${m}`;
      const today = dateKey();

      settings.alerts.forEach((alert) => {
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
  }, [notifyPermission, settings.alerts, settings.alertsEnabled, triggerNotification]);

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
        bump,
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
        saveDhikr,
        saveList,
        notifyPermission,
        requestNotificationPermission
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
