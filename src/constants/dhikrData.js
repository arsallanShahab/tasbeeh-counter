import {
  Sun, Moon, Sunrise, Sunset, Heart, Star, Sparkles
} from "lucide-react";

export const SEED_DHIKRS = [
  { id: "subhanallah", tr: "SubhanAllah", arabic: "سُبْحَانَ ٱللَّٰهِ", en: "Glory be to Allah", ur: "اللہ پاک ہے", target: 33, tags: ["after-salah", "general"] },
  { id: "alhamdulillah", tr: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", en: "All praise is for Allah", ur: "سب تعریف اللہ کے لیے ہے", target: 33, tags: ["after-salah", "general"] },
  { id: "allahuakbar", tr: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ", en: "Allah is the Greatest", ur: "اللہ سب سے بڑا ہے", target: 34, tags: ["after-salah", "general"] },
  { id: "astaghfirullah", tr: "Astaghfirullah", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", en: "I seek the forgiveness of Allah", ur: "میں اللہ سے بخشش مانگتا ہوں", target: 100, tags: ["general", "repentance"] },
  { id: "subhanwabihamdihi", tr: "SubhanAllahi wa bihamdihi", arabic: "سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ", en: "Glory and praise be to Allah", ur: "اللہ پاک ہے اور سب تعریف اسی کی ہے", target: 100, tags: ["general", "morning", "evening"] },
  { id: "subhanalazeem", tr: "SubhanAllahil ‘Azeem", arabic: "سُبْحَانَ ٱللَّٰهِ ٱلْعَظِيمِ", en: "Glory be to Allah, the Magnificent", ur: "اللہ عظمت والا پاک ہے", target: 100, tags: ["general"] },
  { id: "lailaha", tr: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", en: "There is no god but Allah", ur: "اللہ کے سوا کوئی معبود نہیں", target: 100, tags: ["general"] },
  { id: "lahawla", tr: "La hawla wa la quwwata illa billah", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ", en: "There is no might nor power except with Allah", ur: "نیکی کی توفیق اور گناہ سے بچنا صرف اللہ کی مدد سے ہے", target: 100, tags: ["general", "distress"] },
  { id: "durood", tr: "Allahumma salli ‘ala Muhammad", arabic: "ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ", en: "O Allah, send blessings upon Muhammad and the family of Muhammad", ur: "اے اللہ! محمد ﷺ اور آلِ محمد پر درود بھیج", target: 100, tags: ["general", "friday"] },
  { id: "hasbunallah", tr: "Hasbunallahu wa ni‘mal wakeel", arabic: "حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ", en: "Allah is sufficient for us, and He is the best disposer of affairs", ur: "ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے", target: 100, tags: ["general", "distress"] },
  { id: "tahleel", tr: "La ilaha illallahu wahdahu…", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", en: "None has the right to be worshipped but Allah alone, with no partner; His is the dominion and the praise, and He is over all things competent", ur: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں؛ اسی کی بادشاہی اور اسی کے لیے تعریف ہے، اور وہ ہر چیز پر قادر ہے", target: 10, tags: ["morning", "evening", "general"] },
  { id: "kalima1", tr: "La ilaha illallahu Muhammadur Rasulullah", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ", en: "There is no god but Allah; Muhammad is the Messenger of Allah", ur: "اللہ کے سوا کوئی معبود نہیں، محمد ﷺ اللہ کے رسول ہیں", target: 100, tags: ["general"] },
];

export const SEED_LISTS = [
  { id: "after-salah", name: "After Salah", occasion: "after-salah", icon: "sun", note: "Tasbeeh Faatimah — recited after each obligatory prayer (total 100).", steps: [{ dhikr: "subhanallah", target: 33 }, { dhikr: "alhamdulillah", target: 33 }, { dhikr: "allahuakbar", target: 34 }] },
  { id: "istighfar-100", name: "Istighfar ×100", occasion: "repentance", icon: "heart", steps: [{ dhikr: "astaghfirullah", target: 100 }] },
  { id: "durood-100", name: "Durood Sharif ×100", occasion: "friday", icon: "star", steps: [{ dhikr: "durood", target: 100 }] },
  { id: "tasbih-100", name: "SubhanAllahi wa bihamdihi ×100", occasion: "general", icon: "sparkles", steps: [{ dhikr: "subhanwabihamdihi", target: 100 }] },
  { id: "morning", name: "Morning Adhkar (short)", occasion: "morning", icon: "sunrise", note: "A short selection — the full morning adhkar are longer.", steps: [{ dhikr: "subhanwabihamdihi", target: 100 }, { dhikr: "tahleel", target: 10 }, { dhikr: "astaghfirullah", target: 100 }] },
  { id: "evening", name: "Evening Adhkar (short)", occasion: "evening", icon: "moon", note: "A short selection — the full evening adhkar are longer.", steps: [{ dhikr: "subhanwabihamdihi", target: 100 }, { dhikr: "tahleel", target: 10 }, { dhikr: "astaghfirullah", target: 100 }] },
];

export const OCCASIONS = {
  "after-salah": "After Salah", morning: "Morning", evening: "Evening",
  friday: "Friday", repentance: "Repentance", distress: "In Distress", general: "General", custom: "Custom",
};

export const ICONS = { sun: Sun, moon: Moon, sunrise: Sunrise, sunset: Sunset, heart: Heart, star: Star, sparkles: Sparkles };

export const DEFAULT_SETTINGS = {
  lang: "both",
  theme: "emerald",
  appearance: "dark",
  translit: true,
  haptics: true,
  sound: false,
  autoAdvance: true,
  loop: true,
  counterStyle: "beads",
  beadTheme: "onyx",
  activeStyle: "glow",
  customBead: { dark: "#15302a", gold: "#d8a93a" }
};

export const THEMES = {
  classic: {
    name: "Classic Sabḥa",
    dark: {
      "--bg": "#07140f", "--bg2": "#0a1d16", "--surface": "#0f2820",
      "--surface2": "#143729", "--line": "#1d4536", "--text": "#eaf4ee",
      "--muted": "#85a89a", "--primary": "#34b393", "--primary-dim": "#1c5e4c",
      "--gold": "#e0bd5c", "--danger": "#e07a6b",
    },
    light: {
      "--bg": "#f4efe1", "--bg2": "#efe8d5", "--surface": "#ffffff",
      "--surface2": "#faf5e9", "--line": "#e4dcc6", "--text": "#10302a",
      "--muted": "#6c8077", "--primary": "#16785f", "--primary-dim": "#bfe3d6",
      "--gold": "#b0851f", "--danger": "#c14a3a",
    }
  },
  emerald: {
    name: "Emerald Forest",
    dark: {
      "--bg": "#04100b", "--bg2": "#061a12", "--surface": "#09261a",
      "--surface2": "#0e3827", "--line": "#144a34", "--text": "#ecfdf5",
      "--muted": "#52b28c", "--primary": "#10b981", "--primary-dim": "#064e3b",
      "--gold": "#fbbf24", "--danger": "#f87171",
    },
    light: {
      "--bg": "#f0fdf4", "--bg2": "#dcfce7", "--surface": "#ffffff",
      "--surface2": "#f0fdf4", "--line": "#bbf7d0", "--text": "#064e3b",
      "--muted": "#166534", "--primary": "#047857", "--primary-dim": "#a7f3d0",
      "--gold": "#d97706", "--danger": "#dc2626",
    }
  },
  lapis: {
    name: "Ocean Lapis",
    dark: {
      "--bg": "#040d1a", "--bg2": "#06152b", "--surface": "#092040",
      "--surface2": "#0f305c", "--line": "#15437d", "--text": "#f0f7ff",
      "--muted": "#6c93c4", "--primary": "#3b82f6", "--primary-dim": "#1e3a8a",
      "--gold": "#fbbf24", "--danger": "#f87171",
    },
    light: {
      "--bg": "#f0f9ff", "--bg2": "#e0f2fe", "--surface": "#ffffff",
      "--surface2": "#f0f9ff", "--line": "#bae6fd", "--text": "#1e3a8a",
      "--muted": "#0369a1", "--primary": "#1d4ed8", "--primary-dim": "#bfdbfe",
      "--gold": "#d97706", "--danger": "#dc2626",
    }
  },
  rose: {
    name: "Royal Rose",
    dark: {
      "--bg": "#12040a", "--bg2": "#1c0610", "--surface": "#2b0a19",
      "--surface2": "#3d0f25", "--line": "#541433", "--text": "#fff1f2",
      "--muted": "#c9829a", "--primary": "#f43f5e", "--primary-dim": "#4c0519",
      "--gold": "#fbbf24", "--danger": "#f87171",
    },
    light: {
      "--bg": "#fff5f5", "--bg2": "#ffe4e6", "--surface": "#ffffff",
      "--surface2": "#fff5f5", "--line": "#fecdd3", "--text": "#4c0519",
      "--muted": "#be123c", "--primary": "#be123c", "--primary-dim": "#fecdd3",
      "--gold": "#d97706", "--danger": "#dc2626",
    }
  },
  amber: {
    name: "Golden Amber",
    dark: {
      "--bg": "#120b04", "--bg2": "#1c1106", "--surface": "#2b1a09",
      "--surface2": "#3d250d", "--line": "#543313", "--text": "#fef3c7",
      "--muted": "#cf9d5e", "--primary": "#f59e0b", "--primary-dim": "#78350f",
      "--gold": "#fbbf24", "--danger": "#f87171",
    },
    light: {
      "--bg": "#fffbeb", "--bg2": "#fef3c7", "--surface": "#ffffff",
      "--surface2": "#fffbeb", "--line": "#fde68a", "--text": "#78350f",
      "--muted": "#b45309", "--primary": "#b45309", "--primary-dim": "#fde68a",
      "--gold": "#b45309", "--danger": "#dc2626",
    }
  },
  mono: {
    name: "Slate Obsidian",
    dark: {
      "--bg": "#050505", "--bg2": "#0f0f0f", "--surface": "#1a1a1a",
      "--surface2": "#262626", "--line": "#383838", "--text": "#fafafa",
      "--muted": "#a3a3a3", "--primary": "#737373", "--primary-dim": "#262626",
      "--gold": "#e5e5e5", "--danger": "#ef4444",
    },
    light: {
      "--bg": "#fafafa", "--bg2": "#f5f5f5", "--surface": "#ffffff",
      "--surface2": "#fafafa", "--line": "#e5e5e5", "--text": "#171717",
      "--muted": "#525252", "--primary": "#404040", "--primary-dim": "#e5e5e5",
      "--gold": "#a3a3a3", "--danger": "#ef4444",
    }
  }
};

export const BEAD_THEMES = [
  { id: "onyx", name: "Onyx", dark: ["#5f7b71", "#15302a", "#04100b"], gold: ["#ffe6a8", "#d8a93a", "#7a5c16"], front: ["#fff7da", "#ffd866", "#a9802a"], glow: "#ffd866", thread: "#1f4034", arc: "#d8a93a" },
  { id: "sandalwood", name: "Sandalwood", dark: ["#9a7550", "#5a3a22", "#241208"], gold: ["#f2cd8a", "#c08a44", "#6a4418"], front: ["#ffe7b6", "#d99a48", "#7a4e1e"], glow: "#e0a85a", thread: "#3a2414", arc: "#c08a44" },
  { id: "amber", name: "Amber", dark: ["#c08a3a", "#6e451a", "#2e1c08"], gold: ["#ffd27a", "#e8a02e", "#8a5410"], front: ["#fff0b0", "#ffc04d", "#a86c18"], glow: "#ffb84d", thread: "#3a2810", arc: "#e8a02e" },
  { id: "jade", name: "Jade", dark: ["#5f9f86", "#1f5a45", "#0a2c20"], gold: ["#a6eccc", "#3fae86", "#16604a"], front: ["#dcffee", "#5fd6a6", "#1f7a5c"], glow: "#5fd6a6", thread: "#16463a", arc: "#3fae86" },
  { id: "pearl", name: "Pearl", dark: ["#c2ccd2", "#8a949b", "#4a5359"], gold: ["#ffffff", "#d6e2ea", "#9aa8b0"], front: ["#ffffff", "#eef6ff", "#b8ccda"], glow: "#dcecff", thread: "#5a646b", arc: "#acc4d6" },
  { id: "lapis", name: "Lapis", dark: ["#5577b8", "#243f78", "#0c1c40"], gold: ["#a6c4ff", "#4a78d8", "#1e3f8a"], front: ["#e2ecff", "#74a4ff", "#2a52aa"], glow: "#74a4ff", thread: "#1a2e58", arc: "#4a78d8" },
  { id: "ruby", name: "Ruby", dark: ["#b87474", "#7a2f2f", "#3a1414"], gold: ["#ffb4a4", "#d85a4a", "#7a2418"], front: ["#ffdccc", "#ff8a6a", "#a83c22"], glow: "#ff8a6a", thread: "#3e1a1a", arc: "#d85a4a" },
  { id: "amethyst", name: "Amethyst", dark: ["#9a78c0", "#5a3a86", "#2a1648"], gold: ["#d6b4ff", "#9a5ad8", "#5a2a9a"], front: ["#f0e0ff", "#bd84ff", "#6e2eb8"], glow: "#bd84ff", thread: "#341a52", arc: "#9a5ad8" },
  { id: "mono", name: "Mono", dark: ["#9a9a9a", "#3c3c3c", "#101010"], gold: ["#f2f2f2", "#bdbdbd", "#6a6a6a"], front: ["#ffffff", "#e2e2e2", "#8a8a8a"], glow: "#ffffff", thread: "#4a4a4a", arc: "#cfcfcf" },
];
