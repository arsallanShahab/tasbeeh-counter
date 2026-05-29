import {
  Sun, Moon, Sunrise, Sunset, Heart, Star, Sparkles, BookOpen, Shield, Trophy
} from "lucide-react";

export const SEED_DHIKRS = [
  {
    id: "subhanallah",
    tr: "SubhanAllah",
    arabic: "سُبْحَانَ اللّٰهِ",
    en: "Glory be to Allah",
    target: 100,
    tags: ["general"]
  },

  {
    id: "alhamdulillah",
    tr: "Alhamdulillah",
    arabic: "الْحَمْدُ لِلّٰهِ",
    en: "All praise belongs to Allah",
    target: 100,
    tags: ["general", "gratitude"]
  },

  {
    id: "allahuakbar",
    tr: "Allahu Akbar",
    arabic: "اللّٰهُ أَكْبَرُ",
    en: "Allah is the Greatest",
    target: 100,
    tags: ["general"]
  },

  {
    id: "astaghfirullah",
    tr: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللّٰهَ",
    en: "I seek Allah's forgiveness",
    target: 100,
    tags: ["repentance", "forgiveness"]
  },

  {
    id: "astaghfirullah_wa_atubu",
    tr: "Astaghfirullaha wa atubu ilayh",
    arabic: "أَسْتَغْفِرُ اللّٰهَ وَأَتُوبُ إِلَيْهِ",
    en: "I seek Allah's forgiveness and repent to Him",
    target: 100,
    tags: ["repentance"]
  },

  {
    id: "subhanwabihamdihi",
    tr: "SubhanAllahi wa bihamdihi",
    arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ",
    en: "Glory and praise be to Allah",
    target: 100,
    tags: ["morning", "evening", "general"]
  },

  {
    id: "subhanalazeem",
    tr: "SubhanAllahil Azeem",
    arabic: "سُبْحَانَ اللّٰهِ الْعَظِيمِ",
    en: "Glory be to Allah, the Magnificent",
    target: 100,
    tags: ["general"]
  },

  {
    id: "kalimatain",
    tr: "SubhanAllahi wa bihamdihi, SubhanAllahil Azeem",
    arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، سُبْحَانَ اللّٰهِ الْعَظِيمِ",
    en: "Two beloved phrases to Allah",
    target: 100,
    tags: ["general", "high-reward"]
  },

  {
    id: "lailaha",
    tr: "La ilaha illallah",
    arabic: "لَا إِلَٰهَ إِلَّا اللّٰهُ",
    en: "There is no god worthy of worship except Allah",
    target: 100,
    tags: ["tawheed"]
  },

  {
    id: "tahleel",
    tr: "La ilaha illallahu wahdahu la sharika lah...",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    en: "None has the right to be worshipped except Allah alone...",
    target: 100,
    tags: ["morning", "evening", "protection"]
  },

  {
    id: "lahawla",
    tr: "La hawla wa la quwwata illa billah",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ",
    en: "There is no power nor might except with Allah",
    target: 100,
    tags: ["distress", "general"]
  },

  {
    id: "hasbunallah",
    tr: "Hasbunallahu wa ni'mal wakeel",
    arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ",
    en: "Allah is sufficient for us and the best disposer of affairs",
    target: 100,
    tags: ["anxiety", "distress"]
  },

  {
    id: "salawat",
    tr: "Allahumma salli ala Muhammad",
    arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    en: "O Allah send blessings upon Muhammad ﷺ",
    target: 100,
    tags: ["friday", "general"]
  },

  {
    id: "sayyidul_istighfar",
    tr: "Allahumma anta Rabbi la ilaha illa Ant...",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ...",
    en: "The chief supplication for seeking forgiveness",
    target: 1,
    tags: ["morning", "evening", "forgiveness"]
  },

  {
    id: "protection_words",
    tr: "A'udhu bi kalimatillahit tammati min sharri ma khalaq",
    arabic:
      "أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    en: "I seek refuge in Allah's perfect words...",
    target: 3,
    tags: ["protection", "evening"]
  },

  {
    id: "radhitu_billah",
    tr: "Radhitu billahi Rabba...",
    arabic:
      "رَضِيتُ بِاللّٰهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
    en: "I am pleased with Allah as Lord...",
    target: 3,
    tags: ["morning", "evening"]
  },

  {
    id: "bismillah_protection",
    tr: "Bismillahil ladhi la yadurru...",
    arabic:
      "بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
    en: "In the name of Allah with whose name nothing can harm",
    target: 3,
    tags: ["morning", "evening", "protection"]
  },

  {
    id: "subhan_adada",
    tr: "SubhanAllahi wa bihamdihi adada khalqihi...",
    arabic:
      "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ...",
    en: "Glory and praise be to Allah equal to His creation...",
    target: 3,
    tags: ["morning", "high-reward"]
  },

  {
    id: "sleep_tasbeeh",
    tr: "SubhanAllah • Alhamdulillah • Allahu Akbar",
    arabic: "سُبْحَانَ اللّٰهِ • الْحَمْدُ لِلّٰهِ • اللّٰهُ أَكْبَرُ",
    en: "Tasbeeh before sleep",
    target: 100,
    tags: ["sleep"]
  }
];

export const SEED_LISTS = [
  {
    id: "after-salah",
    name: "After Salah",
    occasion: "after-salah",
    icon: "mosque",
    steps: [
      { dhikr: "subhanallah", target: 33 },
      { dhikr: "alhamdulillah", target: 33 },
      { dhikr: "allahuakbar", target: 34 }
    ]
  },

  {
    id: "before-sleep",
    name: "Before Sleep Sunnah Tasbeeh",
    occasion: "sleep",
    icon: "moon",
    steps: [
      { dhikr: "subhanallah", target: 33 },
      { dhikr: "alhamdulillah", target: 33 },
      { dhikr: "allahuakbar", target: 34 }
    ]
  },

  {
    id: "istighfar-100",
    name: "Forgiveness ×100",
    occasion: "forgiveness",
    icon: "heart",
    steps: [
      { dhikr: "astaghfirullah_wa_atubu", target: 100 }
    ]
  },

  {
    id: "sayyidul-istighfar",
    name: "Sayyidul Istighfar",
    occasion: "forgiveness",
    icon: "shield",
    steps: [
      { dhikr: "sayyidul_istighfar", target: 1 }
    ]
  },

  {
    id: "durood-100",
    name: "Durood Sharif ×100",
    occasion: "friday",
    icon: "star",
    steps: [
      { dhikr: "salawat", target: 100 }
    ]
  },

  {
    id: "tasbeeh-100",
    name: "SubhanAllahi wa bihamdihi ×100",
    occasion: "general",
    icon: "sparkles",
    steps: [
      { dhikr: "subhanwabihamdihi", target: 100 }
    ]
  },

  {
    id: "tahleel-100",
    name: "Tahleel ×100",
    occasion: "tawheed",
    icon: "star",
    steps: [
      { dhikr: "tahleel", target: 100 }
    ]
  },

  {
    id: "anxiety-relief",
    name: "For Anxiety & Hardship",
    occasion: "distress",
    icon: "heart",
    steps: [
      { dhikr: "hasbunallah", target: 100 },
      { dhikr: "lahawla", target: 100 }
    ]
  },

  {
    id: "morning-short",
    name: "Morning Adhkar (Short)",
    occasion: "morning",
    icon: "sunrise",
    steps: [
      { dhikr: "radhitu_billah", target: 3 },
      { dhikr: "bismillah_protection", target: 3 },
      { dhikr: "subhan_adada", target: 3 },
      { dhikr: "subhanwabihamdihi", target: 100 },
      { dhikr: "tahleel", target: 100 }
    ]
  },

  {
    id: "evening-short",
    name: "Evening Adhkar (Short)",
    occasion: "evening",
    icon: "moon",
    steps: [
      { dhikr: "radhitu_billah", target: 3 },
      { dhikr: "bismillah_protection", target: 3 },
      { dhikr: "protection_words", target: 3 },
      { dhikr: "subhanwabihamdihi", target: 100 }
    ]
  },

  {
    id: "high-reward",
    name: "Highest Reward Dhikr",
    occasion: "general",
    icon: "trophy",
    steps: [
      { dhikr: "kalimatain", target: 100 },
      { dhikr: "subhanwabihamdihi", target: 100 },
      { dhikr: "tahleel", target: 100 }
    ]
  },

  {
    id: "gratitude",
    name: "Shukr & Gratitude",
    occasion: "gratitude",
    icon: "heart",
    steps: [
      { dhikr: "alhamdulillah", target: 100 },
      { dhikr: "subhanallah", target: 100 }
    ]
  }
];

export const OCCASIONS = {
  "after-salah": "After Salah", morning: "Morning", evening: "Evening",
  friday: "Friday", repentance: "Repentance", distress: "In Distress", general: "General", custom: "Custom",
  sleep: "Sleep", forgiveness: "Forgiveness", tawheed: "Tawheed", gratitude: "Gratitude"
};

export const ICONS = { sun: Sun, moon: Moon, sunrise: Sunrise, sunset: Sunset, heart: Heart, star: Star, sparkles: Sparkles, mosque: BookOpen, shield: Shield, trophy: Trophy };

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
  customBead: { dark: "#15302a", gold: "#d8a93a" },
  alertsEnabled: true,
  alerts: [
    { id: "morning", title: "Morning Adhkar 🌅", body: "Begin your morning with beautiful remembrance.", time: "08:00", enabled: true, targetType: "list", targetId: "morning-short" },
    { id: "evening", title: "Evening Adhkar 🌙", body: "Recite your evening prayers for peace and protection.", time: "17:00", enabled: true, targetType: "list", targetId: "evening-short" },
    { id: "sleep", title: "Bedtime Remembrance 🛏️", body: "Recite the sleep sunnah tasbeeh before resting.", time: "22:00", enabled: true, targetType: "list", targetId: "before-sleep" }
  ]
};

export const THEMES = {
  classic: {
    name: "Sabḥa",
    dark: { "--bg": "#07140f", "--bg2": "#0a1d16", "--surface": "#0f2820", "--surface2": "#143729", "--line": "#1d4536", "--text": "#eaf4ee", "--muted": "#85a89a", "--primary": "#34b393", "--primary-dim": "#1c5e4c", "--gold": "#e0bd5c", "--danger": "#e07a6b" },
    light: { "--bg": "#f4efe1", "--bg2": "#efe8d5", "--surface": "#ffffff", "--surface2": "#faf5e9", "--line": "#e4dcc6", "--text": "#10302a", "--muted": "#6c8077", "--primary": "#16785f", "--primary-dim": "#bfe3d6", "--gold": "#b0851f", "--danger": "#c14a3a" },
  },
  sage: {
    name: "Sage & Oat",
    dark: { "--bg": "#10140e", "--bg2": "#161b12", "--surface": "#1d231a", "--surface2": "#272f23", "--line": "#343d2e", "--text": "#eef1e7", "--muted": "#97a393", "--primary": "#7ea888", "--primary-dim": "#2b3a2d", "--gold": "#cdb277", "--danger": "#cf7e68" },
    light: { "--bg": "#f3f0e7", "--bg2": "#ebe6d9", "--surface": "#fffdf8", "--surface2": "#f4f1e9", "--line": "#ddd6c5", "--text": "#2e3830", "--muted": "#717d6f", "--primary": "#5e8268", "--primary-dim": "#cdddcf", "--gold": "#a98b4e", "--danger": "#b5654d" },
  },
  clay: {
    name: "Warm Clay",
    dark: { "--bg": "#150f0a", "--bg2": "#1b140d", "--surface": "#241a12", "--surface2": "#30231a", "--line": "#3d2e22", "--text": "#f4ece2", "--muted": "#b09680", "--primary": "#c67d5f", "--primary-dim": "#3a261b", "--gold": "#cda35f", "--danger": "#d27c63" },
    light: { "--bg": "#f7f0e6", "--bg2": "#f1e7d8", "--surface": "#fffcf6", "--surface2": "#f7f1e8", "--line": "#e6d8c5", "--text": "#3b2c24", "--muted": "#87705f", "--primary": "#b06a4f", "--primary-dim": "#edd6c6", "--gold": "#a98545", "--danger": "#b55440" },
  },
  olive: {
    name: "Olive Grove",
    dark: { "--bg": "#12130c", "--bg2": "#181910", "--surface": "#202116", "--surface2": "#2b2c1e", "--line": "#393b29", "--text": "#eff0e4", "--muted": "#9b9d82", "--primary": "#9ba259", "--primary-dim": "#313321", "--gold": "#cbb06e", "--danger": "#cf7d64" },
    light: { "--bg": "#f2f1e7", "--bg2": "#eae8d9", "--surface": "#fdfdf7", "--surface2": "#f2f1e7", "--line": "#dcdac5", "--text": "#33352a", "--muted": "#75775f", "--primary": "#7c7f48", "--primary-dim": "#d8dab9", "--gold": "#a98b46", "--danger": "#b25a45" },
  },
  slate: {
    name: "Misty Slate",
    dark: { "--bg": "#0c1114", "--bg2": "#11171b", "--surface": "#182025", "--surface2": "#212c32", "--line": "#2e3b42", "--text": "#eaf1f4", "--muted": "#8ea0aa", "--primary": "#79a0b8", "--primary-dim": "#25333b", "--gold": "#c8ad77", "--danger": "#cf7e6e" },
    light: { "--bg": "#eef0ef", "--bg2": "#e3e8e8", "--surface": "#ffffff", "--surface2": "#f1f4f4", "--line": "#d2d9da", "--text": "#28323a", "--muted": "#6a7780", "--primary": "#5b7c92", "--primary-dim": "#cfdce2", "--gold": "#a78c52", "--danger": "#b25a4e" },
  },
  mocha: {
    name: "Warm Stone",
    dark: { "--bg": "#13100c", "--bg2": "#1a1610", "--surface": "#221c15", "--surface2": "#2e261d", "--line": "#3b3128", "--text": "#f3ece2", "--muted": "#ad9b88", "--primary": "#a98a6c", "--primary-dim": "#38291f", "--gold": "#cda85f", "--danger": "#d07e64" },
    light: { "--bg": "#f5f0e8", "--bg2": "#ede5d9", "--surface": "#fffcf7", "--surface2": "#f5efe6", "--line": "#e3d8c8", "--text": "#382f28", "--muted": "#857668", "--primary": "#8a6f57", "--primary-dim": "#e3d4c3", "--gold": "#ab8a4c", "--danger": "#b35a46" },
  },
  rose: {
    name: "Faded Rose",
    dark: { "--bg": "#140f10", "--bg2": "#1b1416", "--surface": "#241a1c", "--surface2": "#312326", "--line": "#3f2e31", "--text": "#f4ebec", "--muted": "#b29699", "--primary": "#bd848d", "--primary-dim": "#3a2629", "--gold": "#cda75f", "--danger": "#d07d66" },
    light: { "--bg": "#f6f0ee", "--bg2": "#efe3e1", "--surface": "#fffbfa", "--surface2": "#f6efed", "--line": "#e6d4d1", "--text": "#392b2c", "--muted": "#8a7271", "--primary": "#9a6b73", "--primary-dim": "#ecd7d6", "--gold": "#a98a4d", "--danger": "#b3564a" },
  },
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

export const STORAGE_VERSION = 3;
