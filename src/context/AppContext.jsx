import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { SEED_DHIKRS, SEED_LISTS, DEFAULT_SETTINGS } from "../constants/dhikrData";
import { store } from "../utils/storage";
import { dateKey } from "../utils/stats";
import { WebHaptics } from "web-haptics";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("home");
  const [dhikrs, setDhikrs] = useState(SEED_DHIKRS);
  const [lists, setLists] = useState(SEED_LISTS);
  const [pinned, setPinned] = useState(["after-salah", "istighfar-100", "durood-100"]);
  const [stats, setStats] = useState({ total: 0, byDate: {}, perDhikr: {} });
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  const [session, setSession] = useState(null);
  const [modal, setModal] = useState(null);
  const [bump, setBump] = useState(false);
  const [complete, setComplete] = useState(false);
  const [targetEdit, setTargetEdit] = useState(false);
  const [customT, setCustomT] = useState("");
  
  const saveTimer = useRef(null);
  const audioRef = useRef(null);

  /* Load state from storage on init */
  useEffect(() => {
    const loadState = async () => {
      setDhikrs(store.get("dhikrs", SEED_DHIKRS));
      setLists(store.get("lists", SEED_LISTS));
      setPinned(store.get("pinned", ["after-salah", "istighfar-100", "durood-100"]));
      setStats(store.get("stats", { total: 0, byDate: {}, perDhikr: {} }));
      
      // Load and migrate settings if legacy format
      const loadedSettings = store.get("settings", {});
      if (loadedSettings.theme === "dark" || loadedSettings.theme === "light") {
        loadedSettings.appearance = loadedSettings.theme;
        loadedSettings.theme = "emerald";
      }
      
      setSettings({ ...DEFAULT_SETTINGS, ...loadedSettings });
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
    }, 700);
    return () => clearTimeout(saveTimer.current);
  }, [dhikrs, lists, pinned, stats, settings, loaded]);

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
  }, []);

  const startList = useCallback((list) => {
    openSession(list.steps.map((s) => ({ ...s })), list.name, list.occasion, list.id);
  }, [openSession]);

  const startDhikr = useCallback((d) => {
    openSession([{ dhikr: d.id, target: d.target }], d.tr, "general");
  }, [openSession]);

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

      vibe(5);
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
  }, []);

  const goStep = useCallback((dir) => {
    setSession((s) => {
      if (!s) return s;
      const nextIndex = Math.min(Math.max(s.stepIndex + dir, 0), s.steps.length - 1);
      if (nextIndex !== s.stepIndex) {
        vibe(6);
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
    vibe(6);
  }, [vibe]);

  const togglePin = useCallback((id) => {
    setPinned((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }, []);

  const saveDhikr = useCallback((nd, setNd) => {
    if (!nd.tr.trim() || !nd.arabic.trim()) return;
    const id = "c_" + Date.now();
    setDhikrs((ds) => [...ds, { ...nd, id, target: Number(nd.target) || 33, tags: ["custom", "general"] }]);
    setNd({ tr: "", arabic: "", en: "", ur: "", target: 33 });
    setModal(null);
  }, []);

  const saveList = useCallback((nl, setNl) => {
    if (!nl.name.trim() || nl.steps.length === 0) return;
    setLists((ls) => [...ls, { ...nl, id: "c_" + Date.now() }]);
    setNl({ name: "", occasion: "custom", icon: "sparkles", steps: [] });
    setModal(null);
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
        bump,
        complete,
        setComplete,
        targetEdit,
        setTargetEdit,
        customT,
        setCustomT,
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
        saveList
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
