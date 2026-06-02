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
  },

  {
    id: "dua_yunus",
    tr: "La ilaha illa Anta, Subhanaka, inni kuntu minaz-zalimin",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    en: "There is no god but You, glory be to You! Indeed, I have been among the wrongdoers (Du'a of Yunus AS)",
    target: 40,
    tags: ["distress", "repentance", "anxiety", "forgiveness"]
  },

  {
    id: "ya_hayyu_ya_qayyum",
    tr: "Ya Hayyu Ya Qayyum, bi rahmatika astagheeth",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ",
    en: "O Ever-Living, O Sustainer, in Your mercy I seek relief; rectify all my affairs and do not leave me to myself even for the blink of an eye",
    target: 3,
    tags: ["morning", "evening", "distress"]
  },

  {
    id: "hasbiyallah_tawakkaltu",
    tr: "Hasbiyallahu la ilaha illa Huwa, alayhi tawakkaltu",
    arabic: "حَسْبِيَ اللّٰهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    en: "Allah is sufficient for me; there is no god but Him. On Him I rely, and He is the Lord of the Magnificent Throne",
    target: 7,
    tags: ["morning", "evening", "anxiety", "distress"]
  },

  {
    id: "hammi_wal_hazan",
    tr: "Allahumma inni a'udhu bika minal hammi wal hazan...",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
    en: "O Allah, I seek refuge in You from anxiety and grief, weakness and laziness, miserliness and cowardice, the burden of debt and being overpowered by men",
    target: 3,
    tags: ["distress", "anxiety", "morning", "evening"]
  },

  {
    id: "tasbih_fatimah",
    tr: "Tasbih of Fatimah (33 • 33 • 34)",
    arabic: "سُبْحَانَ اللّٰهِ ٣٣ • الْحَمْدُ لِلّٰهِ ٣٣ • اللّٰهُ أَكْبَرُ ٣٤",
    en: "The tasbeeh taught by the Prophet ﷺ to Fatimah RA — recited before sleep",
    target: 100,
    tags: ["sleep", "after-salah"]
  },

  {
    id: "rabbana_atina",
    tr: "Rabbana atina fid-dunya hasanah...",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    en: "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire",
    target: 7,
    tags: ["general", "gratitude"]
  },

  {
    id: "rabbana_zalamna",
    tr: "Rabbana zalamna anfusana...",
    arabic:
      "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    en: "Our Lord, we have wronged ourselves; if You do not forgive us and have mercy on us, we will surely be among the losers (Du'a of Adam AS)",
    target: 7,
    tags: ["repentance", "forgiveness"]
  },

  {
    id: "rabbi_inni_lima",
    tr: "Rabbi inni lima anzalta ilayya min khayrin faqeer",
    arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    en: "My Lord, I am truly in need of whatever good You may have in store for me (Du'a of Musa AS)",
    target: 7,
    tags: ["distress", "general"]
  },

  {
    id: "rabbi_zidni_ilma",
    tr: "Rabbi zidni ilma",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    en: "My Lord, increase me in knowledge",
    target: 7,
    tags: ["knowledge", "general"]
  },

  {
    id: "rabbi_shrah",
    tr: "Rabbi-shrah li sadri wa yassir li amri...",
    arabic:
      "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
    en: "My Lord, expand for me my chest, ease my task, and untie the knot from my tongue so they may understand my speech (Du'a of Musa AS)",
    target: 3,
    tags: ["distress", "general"]
  },

  {
    id: "ainni_ala_dhikrika",
    tr: "Allahumma a'inni ala dhikrika wa shukrika...",
    arabic:
      "اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    en: "O Allah, help me to remember You, thank You, and worship You in the best manner",
    target: 1,
    tags: ["after-salah", "general"]
  },

  {
    id: "allahumma_ajirni",
    tr: "Allahumma ajirni minan-nar",
    arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    en: "O Allah, save me from the Fire",
    target: 7,
    tags: ["morning", "evening"]
  },

  {
    id: "allahumma_innaka_afuw",
    tr: "Allahumma innaka 'Afuwwun tuhibbul afwa fa'fu anni",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    en: "O Allah, You are Most Forgiving, You love forgiveness, so forgive me (Laylat al-Qadr du'a)",
    target: 100,
    tags: ["ramadan", "forgiveness", "repentance"]
  },

  {
    id: "allahumma_aslih",
    tr: "Allahumma aslih li deeni... wa dunyaya... wa akhirati",
    arabic:
      "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي",
    en: "O Allah, set right for me my religion which is the safeguard of my affairs; my worldly life in which is my livelihood; and my Hereafter to which is my return",
    target: 3,
    tags: ["morning", "evening", "general"]
  },

  {
    id: "allahumma_afiyah",
    tr: "Allahumma inni as'aluka al-'afwa wal-'afiyah...",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    en: "O Allah, I ask You for pardon and well-being in this life and the next",
    target: 3,
    tags: ["morning", "evening", "general"]
  },

  {
    id: "allahumma_jannah",
    tr: "Allahumma inni as'alukal jannah wa a'udhu bika minan-nar",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    en: "O Allah, I ask You for Paradise and seek refuge in You from the Fire",
    target: 7,
    tags: ["general"]
  },

  {
    id: "allahumma_husnul_khatimah",
    tr: "Allahumma ahsin aqibatana fil umoori kulliha...",
    arabic:
      "اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الْأُمُورِ كُلِّهَا، وَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الْآخِرَةِ",
    en: "O Allah, make our end good in all matters, and protect us from disgrace in this world and the punishment of the Hereafter",
    target: 3,
    tags: ["general"]
  },

  {
    id: "allahumma_kufr_faqr",
    tr: "Allahumma inni a'udhu bika minal kufri wal faqr...",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ",
    en: "O Allah, I seek refuge in You from disbelief and poverty, and from the punishment of the grave",
    target: 3,
    tags: ["morning", "evening", "protection"]
  },

  {
    id: "allahumma_thabbit",
    tr: "Allahumma ya muqallibal quloob, thabbit qalbi ala deenik",
    arabic: "اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ",
    en: "O Allah, Turner of the hearts, keep my heart firm upon Your religion",
    target: 7,
    tags: ["general", "protection"]
  },

  {
    id: "allahumma_barik",
    tr: "Allahumma barik lana fima razaqtana",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    en: "O Allah, bless us in what You have provided us, and protect us from the punishment of the Fire",
    target: 3,
    tags: ["gratitude", "general"]
  },

  {
    id: "allahumma_la_sahla",
    tr: "Allahumma la sahla illa ma ja'altahu sahla",
    arabic:
      "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    en: "O Allah, there is no ease except in what You make easy, and You make hardship easy when You will",
    target: 3,
    tags: ["distress", "anxiety"]
  },

  {
    id: "rabbana_taqabbal",
    tr: "Rabbana taqabbal minna innaka antas-Sami'ul-'Aleem",
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
    en: "Our Lord, accept this from us. Indeed, You are the All-Hearing, the All-Knowing (Du'a of Ibrahim AS)",
    target: 3,
    tags: ["general", "gratitude"]
  },

  {
    id: "rabbighfirli",
    tr: "Rabbighfir li wa tub alayya, innaka antat-Tawwabur-Raheem",
    arabic:
      "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ، إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    en: "My Lord, forgive me and accept my repentance. Indeed, You are the Accepter of repentance, the Most Merciful",
    target: 100,
    tags: ["repentance", "forgiveness"]
  },

  {
    id: "subhanaka_bihamdika",
    tr: "Subhanaka Allahumma wa bihamdika...",
    arabic:
      "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    en: "Glory and praise be to You, O Allah. I bear witness that none is worthy of worship but You. I seek Your forgiveness and turn to You in repentance (Du'a Kaffarat al-Majlis)",
    target: 3,
    tags: ["repentance", "gathering"]
  },

  {
    id: "subhana_rabbiyal_azeem",
    tr: "SubhanaRabbiyal Azeem",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    en: "Glory be to my Lord, the Magnificent (recited in ruku')",
    target: 3,
    tags: ["salah"]
  },

  {
    id: "subhana_rabbiyal_ala",
    tr: "SubhanaRabbiyal A'la",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
    en: "Glory be to my Lord, the Most High (recited in sujood)",
    target: 3,
    tags: ["salah"]
  },

  {
    id: "salawat_ibrahimiyyah",
    tr: "Allahumma salli ala Muhammad wa ala aali Muhammad...",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    en: "The complete Ibrahimi salawat sent upon the Prophet ﷺ",
    target: 10,
    tags: ["friday", "salah"]
  },

  {
    id: "ya_rabb",
    tr: "Ya Rabb",
    arabic: "يَا رَبِّ",
    en: "O my Lord — a simple, sincere call",
    target: 100,
    tags: ["general"]
  },

  {
    id: "ya_allah",
    tr: "Ya Allah",
    arabic: "يَا اللّٰهُ",
    en: "O Allah",
    target: 100,
    tags: ["general"]
  },

  {
    id: "ya_rahman_ya_raheem",
    tr: "Ya Rahman Ya Raheem",
    arabic: "يَا رَحْمَٰنُ يَا رَحِيمُ",
    en: "O Most Gracious, O Most Merciful",
    target: 100,
    tags: ["general"]
  },

  {
    id: "ya_lateef",
    tr: "Ya Lateef",
    arabic: "يَا لَطِيفُ",
    en: "O Subtle, Kind One — invoked in difficulty",
    target: 129,
    tags: ["distress", "anxiety"]
  },

  {
    id: "ya_wadood",
    tr: "Ya Wadood",
    arabic: "يَا وَدُودُ",
    en: "O Most Loving",
    target: 100,
    tags: ["general"]
  },

  {
    id: "la_ilaha_halim",
    tr: "La ilaha illallahul Halimul Kareem...",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللّٰهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللّٰهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ",
    en: "Du'a of distress — taught by the Prophet ﷺ for moments of grief",
    target: 1,
    tags: ["distress", "anxiety"]
  },

  {
    id: "allahumma_anta_salam",
    tr: "Allahumma antas-Salam wa minkas-salam...",
    arabic:
      "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    en: "O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of majesty and honor (after salah)",
    target: 1,
    tags: ["after-salah"]
  },

  {
    id: "ayat_kursi",
    tr: "Ayat al-Kursi (after salah & before sleep)",
    arabic:
      "اللّٰهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
    en: "Whoever recites Ayat al-Kursi after every salah, nothing keeps him from Paradise but death",
    target: 1,
    tags: ["after-salah", "sleep", "protection"]
  },

  {
    id: "three_quls",
    tr: "Al-Ikhlas • Al-Falaq • An-Nas",
    arabic: "قُلْ هُوَ اللّٰهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    en: "The three Quls — recited morning, evening and before sleep (×3)",
    target: 3,
    tags: ["morning", "evening", "sleep", "protection"]
  },

  {
    id: "lahawla_high_reward",
    tr: "La hawla wa la quwwata illa billah (×100)",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ",
    en: "A treasure from the treasures of Paradise",
    target: 100,
    tags: ["high-reward", "distress"]
  },

  {
    id: "istighfar_70",
    tr: "Astaghfirullah (×70 — daily of the Prophet ﷺ)",
    arabic: "أَسْتَغْفِرُ اللّٰهَ",
    en: "The Prophet ﷺ said he sought forgiveness more than 70 times a day",
    target: 70,
    tags: ["repentance", "forgiveness"]
  },

  {
    id: "ya_arhamar_rahimeen",
    tr: "Ya Arhamar-Rahimeen",
    arabic: "يَا أَرْحَمَ الرَّاحِمِينَ",
    en: "O Most Merciful of those who show mercy",
    target: 100,
    tags: ["general", "distress"]
  },

  {
    id: "rabbi_inni_maghloob",
    tr: "Rabbi inni maghloobun fantasir",
    arabic: "رَبِّ إِنِّي مَغْلُوبٌ فَانْتَصِرْ",
    en: "My Lord, I am overcome, so help me (Du'a of Nuh AS)",
    target: 7,
    tags: ["distress"]
  },

  {
    id: "allahumma_habbib",
    tr: "Allahumma habbib ilayna al-iman wa zayyinhu fi quloobina...",
    arabic:
      "اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا، وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ",
    en: "O Allah, make faith beloved to us and beautify it in our hearts, and make disbelief, wickedness, and disobedience hateful to us",
    target: 3,
    tags: ["general", "morning"]
  },

  {
    id: "allahumma_qini_shuhha",
    tr: "Allahumma qini shuhha nafsi",
    arabic: "اللَّهُمَّ قِنِي شُحَّ نَفْسِي",
    en: "O Allah, protect me from the stinginess of my own soul",
    target: 7,
    tags: ["general"]
  },

  {
    id: "rabbana_la_tuzigh",
    tr: "Rabbana la tuzigh quloobana ba'da idh hadaytana...",
    arabic:
      "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً، إِنَّكَ أَنْتَ الْوَهَّابُ",
    en: "Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower",
    target: 3,
    tags: ["general", "protection"]
  },

  {
    id: "rabbij_alni",
    tr: "Rabbij'alni muqeemas-salati wa min dhurriyyati...",
    arabic:
      "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    en: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication (Du'a of Ibrahim AS)",
    target: 3,
    tags: ["family", "general"]
  },

  {
    id: "rabbana_hab_lana",
    tr: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun...",
    arabic:
      "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    en: "Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us a leader for the righteous",
    target: 3,
    tags: ["family", "general"]
  },

  {
    id: "wa_ufawwidu",
    tr: "Wa ufawwidu amri ilallah, innallaha baseerum bil 'ibaad",
    arabic: "وَأُفَوِّضُ أَمْرِي إِلَى اللّٰهِ، إِنَّ اللّٰهَ بَصِيرٌ بِالْعِبَادِ",
    en: "I entrust my affair to Allah. Indeed, Allah is All-Seeing of His servants",
    target: 7,
    tags: ["distress", "general"]
  },

  {
    id: "innaa_lillah",
    tr: "Inna lillahi wa inna ilayhi raji'oon",
    arabic: "إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    en: "Indeed, to Allah we belong and to Him we shall return (upon hardship)",
    target: 7,
    tags: ["distress"]
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

  // {
  //   id: "istighfar-100",
  //   name: "Forgiveness ×100",
  //   occasion: "forgiveness",
  //   icon: "heart",
  //   steps: [
  //     { dhikr: "astaghfirullah_wa_atubu", target: 100 }
  //   ]
  // },

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
  },

  {
    id: "dua-yunus-40",
    name: "Du'a of Yunus ×40",
    occasion: "distress",
    icon: "shield",
    steps: [
      { dhikr: "dua_yunus", target: 40 }
    ]
  },

  {
    id: "anxiety-deep",
    name: "Deep Anxiety Relief",
    occasion: "distress",
    icon: "heart",
    steps: [
      { dhikr: "dua_yunus", target: 40 },
      { dhikr: "hasbiyallah_tawakkaltu", target: 7 },
      { dhikr: "ya_hayyu_ya_qayyum", target: 3 },
      { dhikr: "allahumma_la_sahla", target: 3 },
      { dhikr: "hammi_wal_hazan", target: 3 }
    ]
  },

  {
    id: "after-salah-full",
    name: "After Salah (Full Sunnah)",
    occasion: "after-salah",
    icon: "mosque",
    steps: [
      { dhikr: "allahumma_anta_salam", target: 1 },
      { dhikr: "ayat_kursi", target: 1 },
      { dhikr: "subhanallah", target: 33 },
      { dhikr: "alhamdulillah", target: 33 },
      { dhikr: "allahuakbar", target: 34 },
      { dhikr: "tahleel", target: 1 },
      { dhikr: "ainni_ala_dhikrika", target: 1 }
    ]
  },

  {
    id: "laylatul-qadr",
    name: "Laylat al-Qadr",
    occasion: "ramadan",
    icon: "star",
    steps: [
      { dhikr: "allahumma_innaka_afuw", target: 100 }
    ]
  },

  {
    id: "friday-salawat",
    name: "Friday Salawat ×100",
    occasion: "friday",
    icon: "star",
    steps: [
      { dhikr: "salawat_ibrahimiyyah", target: 100 }
    ]
  },

  {
    id: "before-sleep-full",
    name: "Before Sleep (Full)",
    occasion: "sleep",
    icon: "moon",
    steps: [
      { dhikr: "ayat_kursi", target: 1 },
      { dhikr: "three_quls", target: 3 },
      { dhikr: "tasbih_fatimah", target: 100 }
    ]
  },

  {
    id: "names-of-allah",
    name: "Calling on Allah's Names",
    occasion: "general",
    icon: "sparkles",
    steps: [
      { dhikr: "ya_rahman_ya_raheem", target: 100 },
      { dhikr: "ya_lateef", target: 129 },
      { dhikr: "ya_wadood", target: 100 },
      { dhikr: "ya_arhamar_rahimeen", target: 100 }
    ]
  },

  {
    id: "family-dua",
    name: "Du'as for Family",
    occasion: "family",
    icon: "heart",
    steps: [
      { dhikr: "rabbij_alni", target: 3 },
      { dhikr: "rabbana_hab_lana", target: 3 },
      { dhikr: "allahumma_habbib", target: 3 }
    ]
  },

  {
    id: "three-pillars-tawbah",
    name: "Three Pillars of Tawbah",
    occasion: "repentance",
    icon: "heart",
    steps: [
      { dhikr: "astaghfirullah", target: 100 },
      { dhikr: "subhanwabihamdihi", target: 100 },
      { dhikr: "dua_yunus", target: 40 }
    ]
  },

  {
    id: "repentance-full",
    name: "Deep Repentance",
    occasion: "repentance",
    icon: "shield",
    steps: [
      { dhikr: "sayyidul_istighfar", target: 1 },
      { dhikr: "istighfar_70", target: 70 },
      { dhikr: "dua_yunus", target: 40 },
      { dhikr: "rabbana_zalamna", target: 7 },
      { dhikr: "rabbighfirli", target: 100 },
      { dhikr: "subhanaka_bihamdika", target: 3 }
    ]
  },

  {
    id: "knowledge-seekers",
    name: "Seekers of Knowledge",
    occasion: "knowledge",
    icon: "star",
    steps: [
      { dhikr: "rabbi_zidni_ilma", target: 33 },
      { dhikr: "rabbi_shrah", target: 3 },
      { dhikr: "ainni_ala_dhikrika", target: 1 }
    ]
  }
];

export const OCCASIONS = {
  "after-salah": "After Salah", morning: "Morning", evening: "Evening",
  friday: "Friday", repentance: "Repentance", distress: "In Distress", general: "General", custom: "Custom",
  sleep: "Sleep", forgiveness: "Forgiveness", tawheed: "Tawheed", gratitude: "Gratitude",
  anxiety: "Anxiety", protection: "Protection", ramadan: "Ramadan", family: "Family",
  knowledge: "Knowledge", salah: "In Salah", "high-reward": "High Reward", gathering: "Gathering"
};

export const ICONS = { sun: Sun, moon: Moon, sunrise: Sunrise, sunset: Sunset, heart: Heart, star: Star, sparkles: Sparkles, mosque: BookOpen, shield: Shield, trophy: Trophy };

export const DEFAULT_SETTINGS = {
  lang: "both",
  theme: "classic",
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

export const STORAGE_VERSION = 4;
