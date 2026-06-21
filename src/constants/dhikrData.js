import {
  Sun, Moon, Sunrise, Sunset, Heart, Star, Sparkles, BookOpen, Shield, Trophy
} from "lucide-react";
import { SEED_NAMES_OF_ALLAH } from "./asmaUlHusna";


export const SEED_DHIKRS = [
  {
    id: "subhanallah",
    tr: "SubhanAllah",
    arabic: "سُبْحَانَ اللّٰهِ",
    en: "Glory be to Allah",
    target: 100,
    tags: ["general", "after-salah"],
    hadith: "The Prophet ﷺ said: 'Two words light upon the tongue, heavy on the scale, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.' (Bukhari 6406, Muslim 2694)",
    story: "SubhanAllah is the declaration that Allah is utterly above every imperfection — recited by the angels, the mountains, the birds, and every atom of creation in its own tongue.",
    benefits: "Cleanses the heart of arrogance and quiets the noise of the ego by re-centering the mind on Allah's perfection."
  },

  {
    id: "alhamdulillah",
    tr: "Alhamdulillah",
    arabic: "الْحَمْدُ لِلّٰهِ",
    en: "All praise belongs to Allah",
    target: 100,
    tags: ["general", "gratitude"],
    hadith: "The Messenger of Allah ﷺ said: 'Alhamdulillah (All praise belongs to Allah) fills the scale (of good deeds).' (Muslim)",
    story: "This phrase represents the highest form of appreciation and praise for Allah's countless gifts, recited by the prophets in times of joy and ease.",
    benefits: "Reciting Alhamdulillah shifts the mind from worry to gratitude, fostering inner content and peacefulness."
  },

  {
    id: "allahuakbar",
    tr: "Allahu Akbar",
    arabic: "اللّٰهُ أَكْبَرُ",
    en: "Allah is the Greatest",
    target: 100,
    tags: ["general", "after-salah"],
    hadith: "The Prophet ﷺ said: 'Whoever says SubhanAllah, Alhamdulillah, and Allahu Akbar 33 times each after every prayer — and completes the hundred with La ilaha illallah... his sins are forgiven even if they are like the foam of the sea.' (Muslim 597)",
    story: "Takbeer is the cry that opens every salah and shrinks every worldly fear: whatever is feared, whatever is desired — Allah is greater than it.",
    benefits: "Dissolves anxiety over status, wealth, and power by reducing every rival concern to nothing in comparison to Allah."
  },

  {
    id: "astaghfirullah",
    tr: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللّٰهَ",
    en: "I seek Allah's forgiveness",
    target: 100,
    tags: ["repentance", "forgiveness"],
    hadith: "The Messenger of Allah ﷺ said: 'If anyone constantly seeks forgiveness, Allah will appoint for him a way out of every distress and a relief from every anxiety.' (Abu Dawud)",
    story: "The act of seeking forgiveness (Istighfar) is the key to spiritual cleansing and was practiced by the Prophet ﷺ more than 70 times a day despite his sinless status.",
    benefits: "Istighfar removes spiritual blockages, washes away guilt, and brings relief from mental burdens and anxiety."
  },

  {
    id: "astaghfirullah_wa_atubu",
    tr: "Astaghfirullaha wa atubu ilayh",
    arabic: "أَسْتَغْفِرُ اللّٰهَ وَأَتُوبُ إِلَيْهِ",
    en: "I seek Allah's forgiveness and repent to Him",
    target: 100,
    tags: ["repentance", "forgiveness"],
    hadith: "Abu Hurayrah ﺭﺽ said: 'I heard the Messenger of Allah ﷺ say: By Allah, I seek Allah's forgiveness and repent to Him more than seventy times each day.' (Bukhari 6307)",
    story: "Istighfar followed by tawbah is two motions of the heart: the tongue admits, then the will turns. Together they form the daily refurbishment of a believer's soul.",
    benefits: "Combines confession with intentional return — repairs the heart faster than istighfar alone, especially after a known slip."
  },

  {
    id: "subhanwabihamdihi",
    tr: "SubhanAllahi wa bihamdihi",
    arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ",
    en: "Glory and praise be to Allah",
    target: 100,
    tags: ["morning", "evening", "general", "high-reward"],
    hadith: "The Prophet ﷺ said: 'Whoever says SubhanAllahi wa bihamdihi a hundred times in a day, his sins are wiped away even if they are like the foam of the sea.' (Bukhari 6405, Muslim 2691)",
    story: "The shortest formula carrying both tasbeeh (declaring purity) and hamd (declaring praise) — beloved enough that a single recitation plants a tree in Paradise.",
    benefits: "Erases countless minor sins in moments; ideal background dhikr while walking, driving, or working."
  },

  {
    id: "subhanalazeem",
    tr: "SubhanAllahil Azeem",
    arabic: "سُبْحَانَ اللّٰهِ الْعَظِيمِ",
    en: "Glory be to Allah, the Magnificent",
    target: 100,
    tags: ["general", "high-reward"],
    hadith: "The Prophet ﷺ said: 'Two phrases light on the tongue, heavy on the scale, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.' (Bukhari 6682)",
    story: "A declaration that the One being glorified is not merely above flaw, but Magnificent in His being — the second half of the two-phrase pair the Prophet ﷺ named beloved to ar-Rahman.",
    benefits: "Anchors the heart in awe (haybah). Recited when standing before a vast scene — the sky, the sea, an open horizon — to convert wonder into worship."
  },

  {
    id: "kalimatain",
    tr: "SubhanAllahi wa bihamdihi, SubhanAllahil Azeem",
    arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، سُبْحَانَ اللّٰهِ الْعَظِيمِ",
    en: "Two beloved phrases to Allah",
    target: 100,
    tags: ["general", "high-reward"],
    hadith: "The Prophet ﷺ said: 'Two phrases light on the tongue, heavy on the scale, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.' (Bukhari 6682, Muslim 2694)",
    story: "The full pairing the Prophet ﷺ singled out from all forms of dhikr — easy to whisper, yet outweighs mountains on the Day the deeds are weighed.",
    benefits: "Maximum weight on the scales for minimum effort — the dhikr to default to when seconds of free time arise."
  },

  {
    id: "lailaha",
    tr: "La ilaha illallah",
    arabic: "لَا إِلَٰهَ إِلَّا اللّٰهُ",
    en: "There is no god worthy of worship except Allah",
    target: 100,
    tags: ["tawheed", "general"],
    hadith: "The Prophet ﷺ said: 'The best dhikr is La ilaha illallah, and the best supplication is Alhamdulillah.' (Tirmidhi 3383)",
    story: "The kalimah of tawheed — the same phrase the Prophet ﷺ said is the testimony required at life's last breath to enter Paradise.",
    benefits: "Renews faith and cleans the heart of hidden attachments — any rival lord (status, fear, desire) collapses before this single word."
  },

  {
    id: "tahleel",
    tr: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadeer",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    en: "None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He has power over all things",
    target: 100,
    tags: ["morning", "evening", "protection", "high-reward"],
    hadith: "The Prophet ﷺ said: 'Whoever says this 100 times a day will have the reward of freeing ten slaves, 100 good deeds written, 100 sins erased, and protection from Shaytan that day until evening.' (Bukhari 3293, Muslim 2691)",
    story: "Tahleel in its full form: tawheed (one God), nafy ash-sharik (no partner), affirmation of mulk (sovereignty) and hamd (praise), and qudrah (power). Five doors of faith opened in one breath.",
    benefits: "Daily shield against Shaytan; the most concentrated investment of reward per minute the Sunnah offers."
  },

  {
    id: "lahawla",
    tr: "La hawla wa la quwwata illa billah",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ",
    en: "There is no power nor might except with Allah",
    target: 100,
    tags: ["distress", "general", "anxiety"],
    hadith: "The Prophet ﷺ said: 'Recite La hawla wa la quwwata illa billah abundantly, for it is a treasure from the treasures of Paradise.' (Bukhari)",
    story: "This phrase is a declaration of absolute reliance on Allah, signifying that no change of state (hawl) or strength (quwwah) exists except by His command.",
    benefits: "Gives strength when physically or emotionally exhausted. Recited during trials to surrender control of the outcome to Allah."
  },

  {
    id: "hasbunallah",
    tr: "Hasbunallahu wa ni'mal wakeel",
    arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ",
    en: "Allah is sufficient for us and the best disposer of affairs",
    target: 100,
    tags: ["anxiety", "distress"],
    hadith: "When the companions were threatened with a massive army, they said: 'Hasbunallahu wa ni'mal wakeel.' (Bukhari)",
    story: "This was the prayer of Prophet Ibrahim AS when he was thrown into the fire, and Prophet Muhammad ﷺ during the Battle of Uhud. In both cases, Allah turned danger into peace.",
    benefits: "Builds absolute trust (*Tawakkul*) in Allah's protection, instantly relieving fear, anxiety, and panic."
  },

  {
    id: "salawat",
    tr: "Allahumma salli ala Muhammad",
    arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    en: "O Allah send blessings upon Muhammad ﷺ",
    target: 100,
    tags: ["friday", "general", "high-reward"],
    hadith: "The Prophet ﷺ said: 'Whoever sends one salawat upon me, Allah sends ten upon him, raises him ten degrees, and writes for him ten good deeds.' (Muslim 408)",
    story: "The only act of worship that begins with Allah Himself doing it: 'Indeed Allah and His angels send blessings upon the Prophet — O you who believe, send blessings upon him.' (al-Ahzab 33:56)",
    benefits: "Ten-fold reward per recitation, sins erased, ranks raised — and the Prophet ﷺ personally returns the salam of whoever sends it. Especially on Fridays."
  },

  {
    id: "sayyidul_istighfar",
    tr: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bi ni'matika alayya wa abu'u bi dhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa Anta",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    en: "O Allah, You are my Lord. There is no god but You. You created me and I am Your servant; I keep Your covenant and pledge to the best of my ability. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins but You — the Chief Supplication for Forgiveness",
    target: 1,
    tags: ["morning", "evening", "forgiveness", "repentance"],
    hadith: "The Prophet ﷺ said: 'Whoever says it during the day with firm faith and dies before evening — or says it at night with firm faith and dies before morning — will be among the people of Paradise.' (Bukhari 6306)",
    story: "Named Sayyidul Istighfar — the Master of Seeking Forgiveness — because it gathers acknowledgement of Lordship, servitude, the covenant, refuge, confession of blessing, confession of sin, and pure tawheed in a single du'a.",
    benefits: "The single most thorough act of repentance available; a daily anchor at dawn and dusk for the believer who fears dying with unconfessed sin."
  },

  {
    id: "protection_words",
    tr: "A'udhu bi kalimatillahit tammati min sharri ma khalaq",
    arabic:
      "أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    en: "I seek refuge in the perfect words of Allah from the evil of what He has created",
    target: 3,
    tags: ["protection", "evening", "anxiety"],
    hadith: "The Prophet ﷺ said: 'Whoever recites this three times when he stops at a place, nothing will harm him until he leaves that place.' (Muslim 2708)",
    story: "The Prophet ﷺ taught this to those traveling, lodging in unfamiliar places, or fearing harm from creatures and unseen evils — the kalimat are perfect because Allah's speech contains no defect.",
    benefits: "Recited at any new place — a hotel room, a forest stop, an empty parking lot — to seal it from harm for the duration of the stay."
  },

  {
    id: "radhitu_billah",
    tr: "Radhitu billahi Rabba, wa bil-Islami deena, wa bi-Muhammadin ﷺ Nabiyya",
    arabic:
      "رَضِيتُ بِاللّٰهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
    en: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet",
    target: 3,
    tags: ["morning", "evening", "gratitude"],
    hadith: "The Prophet ﷺ said: 'It is Allah's right upon every Muslim that whoever says this three times in the morning and three times in the evening — Allah is bound to please him on the Day of Resurrection.' (Tirmidhi 3389, Ahmad 18967)",
    story: "A renewal of the three foundational acceptances every believer makes — the very identity statement of a Muslim, repeated twice daily so it does not become routine.",
    benefits: "Restores contentment when the heart begins to envy other paths, lifestyles, or worldviews."
  },

  {
    id: "bismillah_protection",
    tr: "Bismillahil ladhi la yadurru ma'asmihi shay'un fil ardi wa la fis-sama'i wa Huwas-Samee'ul Aleem",
    arabic:
      "بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ",
    en: "In the name of Allah, with whose name nothing in the earth or the heavens can cause harm, and He is the All-Hearing, the All-Knowing",
    target: 3,
    tags: ["morning", "evening", "protection"],
    hadith: "The Prophet ﷺ said: 'Whoever says this three times in the morning and three times in the evening, nothing will harm him.' (Abu Dawud 5088, Tirmidhi 3388)",
    story: "Total reliance on Allah's name as a shield — affirming that nothing in the heavens or earth has independent power to harm a believer who has invoked Him.",
    benefits: "A daily protective seal against accidents, illness, and sudden misfortune; recited especially when fearing unseen harm."
  },

  {
    id: "subhan_adada",
    tr: "SubhanAllahi wa bihamdihi 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatih",
    arabic:
      "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    en: "Glory and praise be to Allah, equal to the number of His creation, the pleasure of Himself, the weight of His Throne, and the ink of His words",
    target: 3,
    tags: ["morning", "high-reward"],
    hadith: "The Prophet ﷺ told Juwairiya ﺭﺽ that he had said four phrases three times after Fajr that would outweigh all the dhikr she had done since dawn. (Muslim 2726)",
    story: "When Juwairiya sat from dawn till mid-morning making dhikr, the Prophet ﷺ taught her this — a single recitation whose reward measures itself against the number of creatures, the weight of the Throne, and the limitless ink of Allah's words.",
    benefits: "Maximum-leverage dhikr for the busy believer — three recitations purchase the reward of hours of remembrance."
  },

  {
    id: "sleep_tasbeeh",
    tr: "SubhanAllah • Alhamdulillah • Allahu Akbar",
    arabic: "سُبْحَانَ اللّٰهِ • الْحَمْدُ لِلّٰهِ • اللّٰهُ أَكْبَرُ",
    en: "Tasbeeh before sleep",
    target: 100,
    tags: ["sleep"],
    hadith: "The Prophet ﷺ taught Fatimah ﺭﺽ when she asked for a servant: 'When you go to bed, say SubhanAllah 33, Alhamdulillah 33, and Allahu Akbar 34 — that is better for you than a servant.' (Bukhari 5362, Muslim 2727)",
    story: "Fatimah ﺭﺽ — the Prophet's ﷺ beloved daughter — asked for help with grinding flour and household labor. He gave her a string of dhikr instead, teaching that spiritual strength outweighs physical ease.",
    benefits: "Closes the day with the three foundational praises; carries the believer through sleep on a current of remembrance."
  },

  {
    id: "dua_yunus",
    tr: "La ilaha illa Anta, Subhanaka, inni kuntu minaz-zalimin",
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    en: "There is no god but You, glory be to You! Indeed, I have been among the wrongdoers (Du'a of Yunus AS)",
    target: 40,
    tags: ["distress", "repentance", "anxiety", "forgiveness", "grief"],
    hadith: "The Prophet ﷺ said: 'No Muslim supplicates with this du'a for anything, but that Allah answers his prayer.' (Tirmidhi)",
    story: "Prophet Yunus AS called out from the triple darkness of the night, the ocean, and the belly of the whale. Despite the physical impossibility, Allah heard him and saved him.",
    benefits: "The ultimate remedy for deep sadness, grief, depression, and situations that seem completely hopeless."
  },

  {
    id: "ya_hayyu_ya_qayyum",
    tr: "Ya Hayyu Ya Qayyum, bi rahmatika astagheeth",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ",
    en: "O Ever-Living, O Sustainer, in Your mercy I seek relief; rectify all my affairs and do not leave me to myself even for the blink of an eye",
    target: 3,
    tags: ["morning", "evening", "distress", "anxiety"],
    hadith: "Anas ﺭﺽ reported the Prophet ﷺ would call out in distress: 'Ya Hayyu Ya Qayyum, bi rahmatika astagheeth.' (Tirmidhi 3524, graded hasan)",
    story: "Calling on Allah by the two names that hold all creation — al-Hayy (Ever-Living) and al-Qayyum (Self-Sustaining) — is calling on the very source of help when one's own life feels too fragile to hold.",
    benefits: "Particularly powerful when paralyzed by indecision or fear of one's own weakness; teaches the soul not to rely on itself even for an instant."
  },

  {
    id: "hasbiyallah_tawakkaltu",
    tr: "Hasbiyallahu la ilaha illa Huwa, alayhi tawakkaltu",
    arabic: "حَسْبِيَ اللّٰهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    en: "Allah is sufficient for me; there is no god but Him. On Him I rely, and He is the Lord of the Magnificent Throne",
    target: 7,
    tags: ["morning", "evening", "anxiety", "distress", "guidance"],
    hadith: "The Prophet ﷺ said: 'Whoever recites this seven times in the morning and evening, Allah will suffice him for whatever worries him in this world and the next.' (Abu Dawud)",
    story: "A daily shield that protects a believer from the psychological burdens of the future, placing all reliance on the Lord of the Magnificent Throne.",
    benefits: "Relieves daily stress, work pressure, and fear of what the future holds."
  },

  {
    id: "hammi_wal_hazan",
    tr: "Allahumma inni a'udhu bika minal hammi wal hazan, wal 'ajzi wal kasal, wal bukhli wal jubn, wa dala'id-dayn wa ghalabatir-rijal",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
    en: "O Allah, I seek refuge in You from anxiety and grief, weakness and laziness, miserliness and cowardice, the burden of debt and being overpowered by men",
    target: 3,
    tags: ["distress", "anxiety", "morning", "evening", "grief"],
    hadith: "Anas ibn Malik reported: 'The Prophet ﷺ used to make this du'a very frequently.' (Bukhari)",
    story: "A comprehensive prayer specifically addressing the blockages of the human psyche: grief (past regrets), anxiety (future fear), laziness, cowardice, and debt.",
    benefits: "Perfect for breaking out of lethargy, sadness, and overwhelming financial distress."
  },

  {
    id: "tasbih_fatimah",
    tr: "Tasbih of Fatimah (33 • 33 • 34)",
    arabic: "سُبْحَانَ اللّٰهِ ٣٣ • الْحَمْدُ لِلّٰهِ ٣٣ • اللّٰهُ أَكْبَرُ ٣٤",
    en: "The tasbeeh taught by the Prophet ﷺ to Fatimah RA — recited before sleep",
    target: 100,
    tags: ["sleep", "after-salah"],
    hadith: "Ali ﺭﺽ said: 'Whenever I heard this from the Prophet ﷺ, I never left it — not even on the night of Siffin.' (Bukhari 3705, Muslim 2727)",
    story: "Even at war — the eve of the battle of Siffin, with armies camped in the dark — Ali ﺭﺽ did not skip the 33-33-34 of Fatimah's tasbeeh. A small habit defended through the largest events.",
    benefits: "The Prophet's ﷺ practical advice for sustaining strength when life feels physically exhausting; recited every night without exception."
  },

  {
    id: "rabbana_atina",
    tr: "Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina 'adhaban-nar",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    en: "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire",
    target: 7,
    tags: ["general", "gratitude"],
    hadith: "Anas ﺭﺽ said: 'The supplication the Prophet ﷺ most often made was: Rabbana atina fid-dunya hasanah...' (Bukhari 6389, Muslim 2690)",
    story: "From the Qur'an (al-Baqarah 2:201), recommended at Safa and Marwa, between the rukns of the Ka'bah, and after every salah — the du'a that asks for every kind of good in both worlds in eleven Arabic words.",
    benefits: "A complete du'a in one sentence — covers wealth, family, health, faith, Paradise, and protection from the Fire."
  },

  {
    id: "rabbana_zalamna",
    tr: "Rabbana zalamna anfusana, wa in lam taghfir lana wa tarhamna lanakoonanna minal-khasireen",
    arabic:
      "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    en: "Our Lord, we have wronged ourselves; if You do not forgive us and have mercy on us, we will surely be among the losers (Du'a of Adam AS)",
    target: 7,
    tags: ["repentance", "forgiveness"],
    hadith: "Allah taught these words to Adam AS after his slip: 'Then Adam received words from his Lord, and He turned to him in mercy.' (Al-A'raf 7:23, al-Baqarah 2:37)",
    story: "The first du'a of repentance in human history — taught directly by Allah to our father Adam AS when he could find no other path back to his Lord.",
    benefits: "The default du'a after any sin that breaks the heart — confesses wrong, asks both forgiveness and mercy, and admits utter dependence."
  },

  {
    id: "rabbi_inni_lima",
    tr: "Rabbi inni lima anzalta ilayya min khayrin faqeer",
    arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    en: "My Lord, I am truly in need of whatever good You may have in store for me (Du'a of Musa AS)",
    target: 7,
    tags: ["distress", "general", "anxiety"],
    hadith: "Allah preserved this du'a in the Qur'an (al-Qasas 28:24) — said by Musa AS as he sat hungry, alone, and a fugitive in Madyan.",
    story: "Musa AS had no food, no shelter, no people. He helped two strangers water their flock, then sat under a tree and uttered this — Allah's answer arrived within minutes: a wife, a home, a livelihood, and a Prophet's training.",
    benefits: "The du'a of the destitute and uncertain — for anyone needing rizq, opportunity, or a turn in fortune without demanding any specific outcome."
  },

  {
    id: "rabbi_zidni_ilma",
    tr: "Rabbi zidni ilma",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    en: "My Lord, increase me in knowledge",
    target: 7,
    tags: ["knowledge", "general"],
    hadith: "Allah commanded the Prophet ﷺ in the Qur'an: 'And say: My Lord, increase me in knowledge.' (Ta-Ha 20:114)",
    story: "The only du'a in the Qur'an where Allah commands the Prophet ﷺ to ask for an *increase* in something — and that something is knowledge.",
    benefits: "Recited before opening the Qur'an, before lectures, exams, study sessions, or any decision that demands clarity."
  },

  {
    id: "rabbi_shrah",
    tr: "Rabbi-shrah li sadri wa yassir li amri, wahlul 'uqdatam mil-lisani yafqahu qawli",
    arabic:
      "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
    en: "My Lord, expand for me my chest, ease my task, and untie the knot from my tongue so they may understand my speech (Du'a of Musa AS)",
    target: 3,
    tags: ["distress", "general", "knowledge", "anxiety"],
    hadith: "Said by Musa AS when sent to confront Pharaoh — preserved in the Qur'an (Ta-Ha 20:25-28).",
    story: "Musa AS faced the most powerful tyrant of his age with a speech impediment. He did not ask for the throne or the army — only for an expanded chest, an eased task, and a clear tongue.",
    benefits: "Before any difficult conversation, presentation, or confrontation — calms the chest, eases the path, and clears the speech."
  },

  {
    id: "ainni_ala_dhikrika",
    tr: "Allahumma a'inni ala dhikrika wa shukrika wa husni 'ibadatik",
    arabic:
      "اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    en: "O Allah, help me to remember You, thank You, and worship You in the best manner",
    target: 1,
    tags: ["after-salah", "general", "gratitude"],
    hadith: "The Prophet ﷺ took Mu'adh ﺭﺽ by the hand and said: 'O Mu'adh, by Allah I love you — never leave saying after every salah: Allahumma a'inni...' (Abu Dawud 1522, sahih)",
    story: "The personal advice of love from the Prophet ﷺ to Mu'adh — a recognition that dhikr, shukr, and ibadah are not maintained by willpower but by Allah's own help.",
    benefits: "Locked-in after every fardh salah; trains the heart to admit that even the strength to worship is itself a gift to be asked for."
  },

  {
    id: "allahumma_ajirni",
    tr: "Allahumma ajirni minan-nar",
    arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    en: "O Allah, save me from the Fire",
    target: 7,
    tags: ["morning", "evening"],
    hadith: "The Prophet ﷺ said: 'Whoever says Allahumma ajirni minan-nar seven times after Fajr — if he dies that day, he is written as saved from the Fire; whoever says it after Maghrib — if he dies that night, he is written as saved from the Fire.' (Abu Dawud 5079)",
    story: "Two seven-fold recitations bookend the day with the most fundamental request a believer can make of his Lord — refuge from eternal fire.",
    benefits: "A minute of recitation morning and evening invests in the most consequential outcome of all: the soul's destination."
  },

  {
    id: "allahumma_innaka_afuw",
    tr: "Allahumma innaka 'Afuwwun tuhibbul afwa fa'fu anni",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    en: "O Allah, You are Most Forgiving, You love forgiveness, so forgive me (Laylat al-Qadr du'a)",
    target: 100,
    tags: ["ramadan", "forgiveness", "repentance"],
    hadith: "Aisha ﺭﺽ asked: 'O Messenger of Allah, if I find Laylat al-Qadr, what should I say?' He said: 'Say — Allahumma innaka 'Afuwwun tuhibbul afwa fa'fu anni.' (Tirmidhi 3513, sahih)",
    story: "The Prophet's ﷺ recommended du'a for the Night of Decree — one night better than a thousand months, and this is what he chose for it: not wealth, not victory, but pardon.",
    benefits: "The crown du'a of Ramadan's last ten nights; appeals to Allah's love of pardon, not merely His ability to forgive."
  },

  {
    id: "allahumma_aslih",
    tr: "Allahumma aslih li deeniyalladhi huwa 'ismatu amri, wa aslih li dunyayallati feeha ma'ashi, wa aslih li akhiratillati feeha ma'adi",
    arabic:
      "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي",
    en: "O Allah, set right for me my religion which is the safeguard of my affairs; my worldly life in which is my livelihood; and my Hereafter to which is my return",
    target: 3,
    tags: ["morning", "evening", "general", "guidance"],
    hadith: "Abu Hurayrah ﺭﺽ reported that the Prophet ﷺ would say this du'a, asking Allah to set right deen, dunya, and akhirah. (Muslim 2720)",
    story: "A three-domain du'a covering every plane of life: religion as the spine of all affairs, dunya as the field of livelihood, akhirah as the final return — each asked to be set right.",
    benefits: "A daily reset for everything important; recited when the balance of work, family, and worship feels disordered."
  },

  {
    id: "allahumma_afiyah",
    tr: "Allahumma inni as'aluka al-'afwa wal-'afiyah fid-dunya wal-akhirah",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    en: "O Allah, I ask You for pardon and well-being in this life and the next",
    target: 3,
    tags: ["morning", "evening", "general"],
    hadith: "Ibn Umar ﺭﺽ said: 'The Prophet ﷺ never left this du'a in the morning or evening.' (Abu Dawud 5074, Ibn Majah 3871, sahih)",
    story: "'Afiyah is one of the most comprehensive things a believer can be granted — health of body, safety of family, soundness of faith, and freedom from trial. The Prophet ﷺ paired it with 'afw (pardon) so the well-being is also clean of sin.",
    benefits: "The most often-asked-for thing of the Sahabah after Iman; protects against trials one has not yet imagined."
  },

  {
    id: "allahumma_jannah",
    tr: "Allahumma inni as'alukal jannah wa a'udhu bika minan-nar",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    en: "O Allah, I ask You for Paradise and seek refuge in You from the Fire",
    target: 7,
    tags: ["general"],
    hadith: "The Prophet ﷺ said: 'Whoever asks Allah for Paradise three times — Paradise itself says: O Allah, admit him into Paradise. And whoever seeks refuge from the Fire three times — the Fire itself says: O Allah, save him from me.' (Tirmidhi 2572, sahih)",
    story: "Two opposite requests in one breath — the most ambitious and the most essential thing a soul can ask. Paradise and Hell themselves intercede on the speaker's behalf.",
    benefits: "Recited especially before sleep and after every salah; lifts the heart's ceiling beyond worldly worries to its real destination."
  },

  {
    id: "allahumma_husnul_khatimah",
    tr: "Allahumma ahsin 'aqibatana fil-umoori kulliha, wa ajirna min khizyid-dunya wa 'adhabil-akhirah",
    arabic:
      "اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الْأُمُورِ كُلِّهَا، وَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الْآخِرَةِ",
    en: "O Allah, make our end good in all matters, and protect us from disgrace in this world and the punishment of the Hereafter",
    target: 3,
    tags: ["general", "protection"],
    hadith: "Reported in Ahmad (17628) and authenticated by al-Albani — a du'a of the Prophet ﷺ for husnul khatimah (a good ending).",
    story: "The deed is judged by its ending, not its beginning — the believer fears not the start of any matter but the way it closes, especially the closing of life itself.",
    benefits: "Recited at the end of any endeavor — a project, a journey, a season of life — to seal it with Allah's grace rather than human exhaustion."
  },

  {
    id: "allahumma_kufr_faqr",
    tr: "Allahumma inni a'udhu bika minal kufri wal faqr, wa a'udhu bika min 'adhabil-qabr",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ",
    en: "O Allah, I seek refuge in You from disbelief and poverty, and from the punishment of the grave",
    target: 3,
    tags: ["morning", "evening", "protection"],
    hadith: "Abu Bakrah ﺭﺽ reported that the Prophet ﷺ would say: 'Allahumma inni a'udhu bika minal kufri wal faqr, wa min 'adhabil qabr' three times in the morning and three times in the evening. (Abu Dawud 5090, sahih)",
    story: "Three harms named together because they share one root — being cut off from Allah's mercy: kufr cuts the soul off in this world, faqr breaks the spirit, and the punishment of the grave is the first taste of separation in the next.",
    benefits: "A daily seal against the three states a believer most fears: faithlessness, destitution, and torment after death."
  },

  {
    id: "allahumma_thabbit",
    tr: "Allahumma ya muqallibal quloob, thabbit qalbi ala deenik",
    arabic: "اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ",
    en: "O Allah, Turner of the hearts, keep my heart firm upon Your religion",
    target: 7,
    tags: ["general", "protection", "guidance"],
    hadith: "Anas ﺭﺽ said: 'The Prophet ﷺ would say this often.' Aisha ﺭﺽ asked why, and he ﷺ said: 'There is no human being whose heart is not between two of the fingers of the Most Merciful — if He wills, He keeps it firm; if He wills, He turns it.' (Tirmidhi 2140, sahih)",
    story: "Even the Prophet ﷺ — the most steadfast of all — asked Allah to keep his heart firm. If he ﷺ never relied on his own steadiness, no one after him can.",
    benefits: "The single most important du'a for thabaat (steadfastness in faith); recited daily by those who fear losing their iman in the future."
  },

  {
    id: "allahumma_barik",
    tr: "Allahumma barik lana fima razaqtana",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    en: "O Allah, bless us in what You have provided us, and protect us from the punishment of the Fire",
    target: 3,
    tags: ["gratitude", "general"],
    hadith: "Reported in the sunan collections among the du'as said when eating; the Prophet ﷺ taught that asking for barakah in rizq multiplies its benefit beyond its quantity.",
    story: "Barakah is not more — it is enough that goes further. A small meal with barakah satisfies a household; a large one without it leaves the heart still hungry.",
    benefits: "Recited at meals, payday, and over any provision (a new home, car, opportunity) so its surface value becomes lasting benefit."
  },

  {
    id: "allahumma_la_sahla",
    tr: "Allahumma la sahla illa ma ja'altahu sahla",
    arabic:
      "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    en: "O Allah, there is no ease except in what You make easy, and You make hardship easy when You will",
    target: 3,
    tags: ["distress", "anxiety"],
    hadith: "Reported in Sahih Ibn Hibban (970) and Amal al-Yawm wal-Laylah of Ibn al-Sunni — a du'a of the Prophet ﷺ for ease in any matter.",
    story: "Two truths in one du'a: nothing is easy unless Allah makes it easy, and even what looks like granite hardship melts the moment He wills.",
    benefits: "The first du'a to reach for at a stuck door — a closed deal, an unmoving illness, an irreversible-seeming mistake — before turning to any human cause."
  },

  {
    id: "rabbana_taqabbal",
    tr: "Rabbana taqabbal minna innaka antas-Sami'ul-'Aleem",
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
    en: "Our Lord, accept this from us. Indeed, You are the All-Hearing, the All-Knowing (Du'a of Ibrahim AS)",
    target: 3,
    tags: ["general", "gratitude"],
    hadith: "Said by Ibrahim AS and Isma'il AS as they raised the foundations of the Ka'bah, preserved in the Qur'an (al-Baqarah 2:127).",
    story: "Father and son, building the first house of worship stone by stone, asking not for praise or reward — only that Allah accept the work itself.",
    benefits: "The defining du'a of sincerity: said after every act of worship — salah, charity, fast, hajj — to free it from the longing for human praise."
  },

  {
    id: "rabbighfirli",
    tr: "Rabbighfir li wa tub alayya, innaka antat-Tawwabur-Raheem",
    arabic:
      "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ، إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    en: "My Lord, forgive me and accept my repentance. Indeed, You are the Accepter of repentance, the Most Merciful",
    target: 100,
    tags: ["repentance", "forgiveness"],
    hadith: "Ibn Umar ﺭﺽ said: 'We would count that the Prophet ﷺ said this du'a a hundred times in one sitting.' (Abu Dawud 1516, Tirmidhi 3434)",
    story: "A double-action du'a — asking for forgiveness (maghfirah) of past sins and acceptance of repentance (tawbah) so the heart returns clean to the road forward.",
    benefits: "The Prophet's ﷺ own repetition pattern — a hundred recitations per sitting saturates the heart with maghfirah and softens the resolve to sin again."
  },

  {
    id: "subhanaka_bihamdika",
    tr: "Subhanakallahumma wa bihamdika, ash-hadu an la ilaha illa Anta, astaghfiruka wa atoobu ilayk",
    arabic:
      "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    en: "Glory and praise be to You, O Allah. I bear witness that none is worthy of worship but You. I seek Your forgiveness and turn to You in repentance (Du'a Kaffarat al-Majlis)",
    target: 3,
    tags: ["repentance", "gathering", "forgiveness"],
    hadith: "The Prophet ﷺ said: 'Whoever sits in a gathering in which much idle talk takes place and says this before standing — Allah forgives whatever happened in that gathering.' (Tirmidhi 3433, sahih)",
    story: "The closing seal of any gathering — a meeting, a meal, an online conversation. Whatever ghibah, idle words, or thoughtless talk slipped through is forgiven before standing.",
    benefits: "Daily insurance against the sins of speech that pile up in social settings; recited before leaving any room or chat."
  },

  {
    id: "subhana_rabbiyal_azeem",
    tr: "SubhanaRabbiyal Azeem",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    en: "Glory be to my Lord, the Magnificent (recited in ruku')",
    target: 3,
    tags: ["salah"],
    hadith: "When the verse 'Glorify the name of your Lord, the Magnificent' (al-Waqi'ah 56:74) was revealed, the Prophet ﷺ said: 'Make it in your ruku'.' (Abu Dawud 869, sahih)",
    story: "The body bowed to its full depth, the tongue declaring the Magnificence of the One bowed to — outer and inner submission aligned.",
    benefits: "Recited at least three times in every ruku' of every salah; the perfect formula for the moment a believer's spine bends to Allah."
  },

  {
    id: "subhana_rabbiyal_ala",
    tr: "SubhanaRabbiyal A'la",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
    en: "Glory be to my Lord, the Most High (recited in sujood)",
    target: 3,
    tags: ["salah"],
    hadith: "When 'Glorify the name of your Lord, the Most High' (al-A'la 87:1) was revealed, the Prophet ﷺ said: 'Make it in your sujood.' (Abu Dawud 869, sahih)",
    story: "The face — the most honored part of the body — placed on the ground, the tongue declaring the Most High. The lowest physical posture invoking the highest name.",
    benefits: "Recited in sujood, the closest position to Allah a believer attains in this world; du'as made here are most accepted (Muslim 482)."
  },

  {
    id: "salawat_ibrahimiyyah",
    tr: "Allahumma salli ala Muhammadin wa ala aali Muhammad, kama sallayta ala Ibrahima wa ala aali Ibrahim, innaka Hameedun Majeed. Allahumma barik ala Muhammadin wa ala aali Muhammad, kama barakta ala Ibrahima wa ala aali Ibrahim, innaka Hameedun Majeed",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    en: "O Allah, send prayers upon Muhammad and the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Most Glorious. O Allah, send blessings upon Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Most Glorious — the complete Ibrahimi Salawat",
    target: 10,
    tags: ["friday", "salah", "high-reward"],
    hadith: "When the companions asked: 'How do we send salawat upon you, O Messenger of Allah?' he ﷺ taught them this exact wording. (Bukhari 3370, Muslim 406)",
    story: "The form of salawat the Prophet ﷺ himself prescribed — the same wording recited in the final sitting of every salah by every Muslim on earth, five times a day, for fourteen centuries.",
    benefits: "The salawat with the most precise wording from the Prophet ﷺ; carries every blessing previously given to the household of Ibrahim AS."
  },

  {
    id: "ya_rabb",
    tr: "Ya Rabb",
    arabic: "يَا رَبِّ",
    en: "O my Lord — a simple, sincere call",
    target: 100,
    tags: ["general", "distress"],
    hadith: "The Prophet ﷺ described a man who travels long, becomes disheveled, and raises his hands: 'Ya Rabb, Ya Rabb...' — and the answer comes despite his sins. (Muslim 1015)",
    story: "Two letters in Arabic — Ya Rabb — that exhaust the human capacity for speech when the heart can say nothing more. The closest call a soul knows.",
    benefits: "When words fail in du'a — pain too deep, joy too full, request too tangled — fall back to this. The Prophet ﷺ promised it reaches Allah."
  },

  {
    id: "ya_allah",
    tr: "Ya Allah",
    arabic: "يَا اللّٰهُ",
    en: "O Allah",
    target: 100,
    tags: ["general", "distress"],
    hadith: "Anas ﺭﺽ reported that the Prophet ﷺ heard a man say in his salah: 'O Allah, by the fact that to You belongs all praise, there is no god but You alone, the Bestower...' He said: 'He has called Allah by His Greatest Name — when called by it, He gives; when supplicated by it, He answers.' (Abu Dawud 1495, sahih)",
    story: "Allah is the proper name of the Divine — the only name no other being shares. Its mere utterance, with presence of heart, is itself a complete remembrance.",
    benefits: "The simplest, most direct call — for when the heart is too tired to compose a du'a, the name itself is the du'a."
  },

  {
    id: "ya_rahman_ya_raheem",
    tr: "Ya Rahman Ya Raheem",
    arabic: "يَا رَحْمَٰنُ يَا رَحِيمُ",
    en: "O Most Gracious, O Most Merciful",
    target: 100,
    tags: ["general", "gratitude"],
    hadith: "Allah says: 'Call upon Allah or call upon ar-Rahman; whichever you call — to Him belong the most beautiful names.' (al-Isra 17:110)",
    story: "Ar-Rahman is mercy in its universal sweep — sun, rain, breath given to all; ar-Raheem is mercy specifically directed to believers in this life and the next. Called together they cover every scope of mercy.",
    benefits: "Recited when one feels undeserving of mercy or unable to ask for what is needed — invokes Allah specifically through the names of His mercy."
  },

  {
    id: "ya_lateef",
    tr: "Ya Lateef",
    arabic: "يَا لَطِيفُ",
    en: "O Subtle, Kind One — invoked in difficulty",
    target: 129,
    tags: ["distress", "anxiety", "guidance"],
    hadith: "Allah's name al-Lateef appears in the Qur'an: 'Allah is Subtle with His servants — He provides for whom He wills.' (ash-Shura 42:19)",
    story: "Lateef means both subtle (knowing the finest details) and gentle (acting in ways too refined for the eye to trace). The count of 129 corresponds to the numerical value of the name in the abjad reckoning used by classical scholars.",
    benefits: "The name of choice when the door appears closed and no human path opens — invoking the One whose kindness arrives by routes the heart could not have imagined."
  },

  {
    id: "ya_wadood",
    tr: "Ya Wadood",
    arabic: "يَا وَدُودُ",
    en: "O Most Loving",
    target: 100,
    tags: ["general", "family"],
    hadith: "Allah says: 'Indeed my Lord is Most Merciful, Most Loving.' (Hud 11:90) and 'He is the All-Forgiving, the Most Loving.' (al-Buruj 85:14)",
    story: "Al-Wadood is love that initiates, not merely responds — Allah loves His servants before they remember Him. The same root gives the word for the strong, demonstrative affection between spouses.",
    benefits: "Recited to soften hearts — between estranged spouses, parents and children, friends after a quarrel — by appealing to the source of all love."
  },

  {
    id: "la_ilaha_halim",
    tr: "La ilaha illallahul Halimul Kareem, SubhanAllahi Rabbil 'Arshil 'Azeem, Alhamdulillahi Rabbil 'aalameen",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللّٰهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللّٰهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ",
    en: "Du'a of distress — taught by the Prophet ﷺ for moments of grief",
    target: 1,
    tags: ["distress", "anxiety", "grief"],
    hadith: "Ibn Abbas ﺭﺽ reported that the Prophet ﷺ would say in distress: 'La ilaha illallahul Halimul Kareem, SubhanAllahi Rabbil 'Arshil 'Azeem, Alhamdulillahi Rabbil 'aalameen.' (Bukhari 6346, Muslim 2730)",
    story: "Three statements pulled together in moments of unbearable weight: tawheed of the Forbearing and Generous, glorification of the Lord of the Mighty Throne, and praise of the Lord of all worlds.",
    benefits: "The Prophet's ﷺ own dhikr for the heaviest moments — recited when grief or anxiety has no specific name, only a crushing weight."
  },

  {
    id: "dua_al_karb",
    tr: "La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللّٰهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللّٰهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللّٰهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    en: "There is no god but Allah, the Incomparably Great, the Forbearing. There is no god but Allah, the Lord of the Mighty Throne. There is no god but Allah, the Lord of the heavens and the Lord of the earth, and the Lord of the Noble Throne (Du'a al-Karb — the supplication for distress)",
    target: 3,
    tags: ["distress", "anxiety", "grief"],
    hadith: "Ibn Abbas ﺭﺽ reported that in times of distress the Prophet ﷺ would say: 'La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim.' (Bukhari 6345, Muslim 2730)",
    story: "The Du'a al-Karb — the supplication for distress. Before asking for a single thing, it magnifies Allah three times over: the Forbearing who is never hasty to punish, the Lord of the Mighty Throne, and the Lord of the heavens, the earth, and the Noble Throne. The relief is found in remembering who He is before the trial is even named.",
    benefits: "The Prophet's ﷺ go-to dhikr when seized by worry, anxiety, or severe hardship; re-anchors the heart in Allah's greatness above the burden, turning panic into trust."
  },

  {
    id: "allahumma_anta_salam",
    tr: "Allahumma antas-Salam wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram",
    arabic:
      "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    en: "O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of majesty and honor (after salah)",
    target: 1,
    tags: ["after-salah"],
    hadith: "Thawban ﺭﺽ said: 'When the Prophet ﷺ finished his salah, he would seek forgiveness three times and then say: Allahumma antas-Salam wa minkas-salam, tabarakta Ya Dhal Jalali wal Ikram.' (Muslim 591)",
    story: "The first words from the Prophet's ﷺ lips after every fardh salah — invoking Allah by His name as-Salam (Peace) to transition from the silence of standing before Allah to the noise of the world.",
    benefits: "A daily fix-point for inner peace; recited the moment after taslim so the calm of salah is sealed before reaching for the phone."
  },

  {
    id: "ayat_kursi",
    tr: "Allahu la ilaha illa Huwal-Hayyul-Qayyoom, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhalladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydeehim wa ma khalfahum, wa la yuheetoona bi shay'in min 'ilmihi illa bima sha'a, wasi'a kursiyyuhus-samawati wal-ard, wa la ya'ooduhu hifzuhuma, wa Huwal-'Aliyyul-'Azeem",
    arabic:
      "اللّٰهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    en: "Allah — there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass nothing of His knowledge except for what He wills. His Throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great (Al-Baqarah 2:255) — whoever recites it after every salah, nothing keeps him from Paradise but death",
    target: 1,
    tags: ["after-salah", "sleep", "protection"],
    hadith: "The Prophet ﷺ said: 'Whoever recites Ayat al-Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death.' (An-Nasa'i in Amal al-Yawm 100, sahih)",
    story: "The single greatest verse in the Qur'an by the Prophet's ﷺ own testimony (Muslim 810). Each clause unfolds a name or attribute of Allah, ending with a confession of His exaltedness above all creation.",
    benefits: "Recited at night, a believer is guarded by an angel until dawn (Bukhari 2311); recited after salah, the path to Paradise is opened at the moment of death."
  },

  {
    id: "three_quls",
    tr: "Al-Ikhlas • Al-Falaq • An-Nas",
    arabic: "قُلْ هُوَ اللّٰهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    en: "The three Quls — recited morning, evening and before sleep (×3)",
    target: 3,
    tags: ["morning", "evening", "sleep", "protection"],
    hadith: "The Prophet ﷺ told Uqbah ﺭﺽ: 'Recite the three Quls three times in the morning and evening — they will suffice you against everything.' (Abu Dawud 5082, Tirmidhi 3575)",
    story: "Three short surahs covering the full sphere of belief: Ikhlas affirms tawheed; Falaq protects from external evils (creatures, envy, magic); Nas protects from internal whispers and human harm.",
    benefits: "A complete spiritual immune system — guards against the seen, the unseen, and the whispered, in under a minute."
  },

  {
    id: "lahawla_high_reward",
    tr: "La hawla wa la quwwata illa billah (×100)",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ",
    en: "A treasure from the treasures of Paradise",
    target: 100,
    tags: ["high-reward", "distress", "anxiety"],
    hadith: "The Prophet ﷺ said to Abu Musa al-Ash'ari ﺭﺽ: 'Shall I not point you to a treasure from the treasures of Paradise? La hawla wa la quwwata illa billah.' (Bukhari 4205, Muslim 2704)",
    story: "Recited a hundred times — the daily dose for a believer who needs both spiritual strength and the steady reminder that no movement of his own carries any power apart from Allah.",
    benefits: "Cures hidden self-reliance; recited especially when overwhelmed by responsibilities one cannot logically see a way through."
  },

  {
    id: "istighfar_70",
    tr: "Astaghfirullah (×70 — daily of the Prophet ﷺ)",
    arabic: "أَسْتَغْفِرُ اللّٰهَ",
    en: "The Prophet ﷺ said he sought forgiveness more than 70 times a day",
    target: 70,
    tags: ["repentance", "forgiveness"],
    hadith: "Abu Hurayrah ﺭﺽ reported: 'I heard the Messenger of Allah ﷺ say: By Allah, I seek forgiveness of Allah and repent to Him more than seventy times in a day.' (Bukhari 6307)",
    story: "Seventy was not the Prophet's ﷺ daily target — it was his minimum. A man without sin asked for forgiveness more than most do their morning coffee.",
    benefits: "Walks the believer along the Prophet's ﷺ own pattern of constant return to Allah; humbles the heart by exposing how rare istighfar is despite how much it is needed."
  },

  {
    id: "ya_arhamar_rahimeen",
    tr: "Ya Arhamar-Rahimeen",
    arabic: "يَا أَرْحَمَ الرَّاحِمِينَ",
    en: "O Most Merciful of those who show mercy",
    target: 100,
    tags: ["general", "distress", "anxiety"],
    hadith: "Said by Yusuf AS's father Ya'qub AS in his sorrow (Yusuf 12:64) and by Ayyub AS in his suffering (al-Anbiya 21:83) — preserved in the Qur'an.",
    story: "Two prophets at the depths of human grief — one separated from his son for decades, one stripped of family and health — both reached for the same address: O Most Merciful of those who show mercy.",
    benefits: "Recited in unbearable trial; appeals to Allah by the very superlative of mercy when nothing else of one's own remains to offer."
  },

  {
    id: "rabbi_inni_maghloob",
    tr: "Rabbi inni maghloobun fantasir",
    arabic: "رَبِّ إِنِّي مَغْلُوبٌ فَانْتَصِرْ",
    en: "My Lord, I am overcome, so help me (Du'a of Nuh AS)",
    target: 7,
    tags: ["distress", "anxiety"],
    hadith: "Said by Nuh AS after 950 years of rejection, preserved in the Qur'an (al-Qamar 54:10).",
    story: "Nine and a half centuries of preaching, mockery, and rejection — and only this single sentence of complaint to Allah. The flood that followed was Allah's answer.",
    benefits: "The du'a when one has tried everything human and nothing has worked — surrenders the outcome to the only One whose help cannot fail."
  },

  {
    id: "allahumma_habbib",
    tr: "Allahumma habbib ilayna al-iman wa zayyinhu fi quloobina, wa karrih ilayna al-kufra wal-fusooqa wal-'isyan",
    arabic:
      "اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا، وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ",
    en: "O Allah, make faith beloved to us and beautify it in our hearts, and make disbelief, wickedness, and disobedience hateful to us",
    target: 3,
    tags: ["general", "morning", "guidance"],
    hadith: "Allah praises in the Qur'an those whose hearts He has done this for: 'Allah has endeared to you faith and beautified it in your hearts, and has made hateful to you disbelief, defiance, and disobedience.' (al-Hujurat 49:7) — recited as a du'a.",
    story: "True iman is not just believed — it is *loved*. This du'a asks for the heart's preferences themselves to be re-shaped so faith feels sweet and sin feels ugly.",
    benefits: "Recited when one finds religious acts feeling like burdens and sin feeling attractive — the inner taste is being asked to be turned right side up."
  },

  {
    id: "allahumma_qini_shuhha",
    tr: "Allahumma qini shuhha nafsi",
    arabic: "اللَّهُمَّ قِنِي شُحَّ نَفْسِي",
    en: "O Allah, protect me from the stinginess of my own soul",
    target: 7,
    tags: ["general", "gratitude"],
    hadith: "Allah says in the Qur'an: 'Whoever is protected from the stinginess of his soul — those are the successful.' (al-Hashr 59:9, at-Taghabun 64:16) — taken as a du'a.",
    story: "Shuhh is deeper than miserliness with money — it is the inner clinging to anything good (time, knowledge, attention, status) that Allah has placed in one's care.",
    benefits: "Opens the hand and the heart — the prerequisite for sadaqah, kindness, forgiveness of others, and ease in giving up what Allah requires."
  },

  {
    id: "rabbana_la_tuzigh",
    tr: "Rabbana la tuzigh quloobana ba'da idh hadaytana, wa hab lana min ladunka rahmatan, innaka Antal-Wahhab",
    arabic:
      "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً، إِنَّكَ أَنْتَ الْوَهَّابُ",
    en: "Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower",
    target: 3,
    tags: ["general", "protection", "guidance"],
    hadith: "Preserved in the Qur'an (Al Imran 3:8) — the du'a of those firmly rooted in knowledge.",
    story: "A confession that the heart is not self-stable: it can drift after guidance, fall after standing, and grow cold after warmth. So the believer asks the One who turns the hearts to keep his fixed.",
    benefits: "Recited when faith feels strong (to keep it) and when it feels weak (to restore it) — guards against the slow drift no one notices until it is far."
  },

  {
    id: "rabbij_alni",
    tr: "Rabbij'alni muqeemas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a",
    arabic:
      "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    en: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication (Du'a of Ibrahim AS)",
    target: 3,
    tags: ["family", "general"],
    hadith: "Said by Ibrahim AS in his old age, preserved in the Qur'an (Ibrahim 14:40).",
    story: "Ibrahim AS asked not for wealthy descendants or famous ones — but for descendants who establish salah. Centuries later, the line included our Prophet ﷺ.",
    benefits: "The defining du'a for parents who want their lineage to carry faith forward — recited for unborn children, present children, and grandchildren yet to come."
  },

  {
    id: "rabbana_hab_lana",
    tr: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin, waj'alna lil-muttaqeena imama",
    arabic:
      "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    en: "Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us a leader for the righteous",
    target: 3,
    tags: ["family", "general"],
    hadith: "Preserved in the Qur'an (al-Furqan 25:74) as the closing du'a of 'Ibad ar-Rahman — the servants of the Most Merciful.",
    story: "The crown verse of the description of the believers — they do not ask only for righteous families, but to *lead* the righteous, raising the ceiling of their ambition for piety.",
    benefits: "A nightly du'a for marriage, parenting, and family — turning the home into the cradle of the next generation of righteous leaders."
  },

  {
    id: "wa_ufawwidu",
    tr: "Wa ufawwidu amri ilallah, innallaha baseerum bil 'ibaad",
    arabic: "وَأُفَوِّضُ أَمْرِي إِلَى اللّٰهِ، إِنَّ اللّٰهَ بَصِيرٌ بِالْعِبَادِ",
    en: "I entrust my affair to Allah. Indeed, Allah is All-Seeing of His servants",
    target: 7,
    tags: ["distress", "general", "anxiety"],
    hadith: "Said by the believer of Pharaoh's family who warned his people of Allah's punishment — preserved in the Qur'an (Ghafir 40:44).",
    story: "A man alone before a tyrant's court, having delivered the warning, says these words and walks away. Allah immediately follows with: 'So Allah protected him from the evils they plotted.' (40:45)",
    benefits: "The du'a of clean conscience — for the moment one has done their part and must release the outcome to the only One who sees the full picture."
  },

  {
    id: "innaa_lillah",
    tr: "Inna lillahi wa inna ilayhi raji'oon",
    arabic: "إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    en: "Indeed, to Allah we belong and to Him we shall return (upon hardship)",
    target: 7,
    tags: ["distress", "grief"],
    hadith: "The Prophet ﷺ said: 'If any Muslim says: Inna lillahi wa inna ilayhi raji'oon... when a calamity strikes, Allah will reward him and compensate him with something better.' (Muslim)",
    story: "Recited by believers when struck by any loss, big or small, to remind themselves that they and all their loved ones belong to Allah and will return to Him.",
    benefits: "Eases the sharp pain of bereavement, loss, and sudden trials by providing immediate spiritual perspective."
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
      { dhikr: "dua_al_karb", target: 3 },
      { dhikr: "hasbiyallah_tawakkaltu", target: 7 },
      { dhikr: "ya_hayyu_ya_qayyum", target: 3 },
      { dhikr: "allahumma_la_sahla", target: 3 },
      { dhikr: "hammi_wal_hazan", target: 3 }
    ]
  },

  {
    id: "dua-al-karb",
    name: "Du'a al-Karb (For Distress)",
    occasion: "distress",
    icon: "shield",
    steps: [
      { dhikr: "dua_al_karb", target: 3 }
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
  knowledge: "Knowledge", salah: "In Salah", "high-reward": "High Reward", gathering: "Gathering",
  grief: "In Grief", guidance: "Seeking Guidance", "names-of-allah": "99 Names"
};

export const ICONS = { sun: Sun, moon: Moon, sunrise: Sunrise, sunset: Sunset, heart: Heart, star: Star, sparkles: Sparkles, mosque: BookOpen, shield: Shield, trophy: Trophy };

// Default icon per occasion — used by Quick Collections on Home
export const OCCASION_ICONS = {
  "after-salah": Sun,
  morning: Sunrise,
  evening: Moon,
  friday: Star,
  repentance: Heart,
  distress: Shield,
  general: Sparkles,
  custom: Sparkles,
  sleep: Moon,
  forgiveness: Heart,
  tawheed: Star,
  gratitude: Heart,
  anxiety: Shield,
  protection: Shield,
  ramadan: Sparkles,
  family: Heart,
  knowledge: BookOpen,
  salah: Sun,
  "high-reward": Trophy,
  gathering: Sparkles,
  grief: Heart,
  guidance: Star,
  "names-of-allah": Sparkles
};

export const DEFAULT_QUICK_COLLECTIONS = ["morning", "evening", "after-salah", "friday"];

// Home page widget sections — order and visibility are user-configurable in
// Settings. The "continue" widget (active session) is contextual and renders
// independently above the configurable stack.
export const HOME_SECTIONS = {
  prayer: { label: "Prayer Times" },
  occasion: { label: "Occasion of the Day" },
  streak: { label: "Daily Streak & Goal" },
  remedies: { label: "Remedies for the Heart" },
  asmaul_husna: { label: "Asma-ul-Husna Mode" },
  quick: { label: "Quick Collections" },
  suggested: { label: "Suggested Session" },
  pinned: { label: "Your Widgets" },
};
export const DEFAULT_HOME_SECTIONS = [
  { key: "prayer", visible: true },
  { key: "occasion", visible: true },
  { key: "streak", visible: true },
  { key: "remedies", visible: true },
  { key: "asmaul_husna", visible: true },
  { key: "quick", visible: true },
  { key: "suggested", visible: true },
  { key: "pinned", visible: true },
];

export const EMOTIONAL_REMEDIES = {
  anxiety: {
    key: "anxiety",
    label: "Anxious & Overwhelmed 🛡️",
    desc: "For easing worry, stress, and fear of the future",
    icon: Shield,
    color: "var(--primary)"
  },
  distress: {
    key: "distress",
    label: "In Hardship & Distress 📿",
    desc: "For seeking relief and strength in difficult times",
    icon: Shield,
    color: "var(--primary)"
  },
  grief: {
    key: "grief",
    label: "Grieving or Sad 🕊️",
    desc: "For comfort in times of loss, sorrow, or heartbreak",
    icon: Heart,
    color: "var(--gold)"
  },
  repentance: {
    key: "repentance",
    label: "Seeking Forgiveness 🤍",
    desc: "For clearing guilt and returning to Allah in sincerity",
    icon: Heart,
    color: "var(--danger)"
  },
  gratitude: {
    key: "gratitude",
    label: "Cultivating Shukr 🌸",
    desc: "For countering ungratefulness and feeling content",
    icon: Heart,
    color: "var(--gold)"
  },
  guidance: {
    key: "guidance",
    label: "Lost & Seeking Direction 🧭",
    desc: "For making decisions and finding clarity",
    icon: Star,
    color: "var(--primary)"
  }
};

export { SEED_NAMES_OF_ALLAH };


export const DHIKR_FIELDS = {
  arabic: { label: "Arabic" },
  translit: { label: "Transliteration" },
  translation: { label: "Translation" },
};

export const DEFAULT_DHIKR_FIELD_ORDER = ["arabic", "translit", "translation"];
export const DEFAULT_DHIKR_FIELD_VISIBLE = { arabic: true, translit: true, translation: true };

// Selectable typefaces for the Arabic script. Each is loaded from Google Fonts
// (see the @import in index.css). `stack` is dropped into the --font-arabic CSS
// variable at runtime; `lh` bumps line-height for tall calligraphic styles like
// Nastaliq so harakat/descenders don't clip against the tighter Tailwind leadings.
export const ARABIC_FONTS = [
  { id: "amiri", name: "Amiri", sub: "Naskh · Classic", stack: "'Amiri', serif" },
  { id: "scheherazade", name: "Scheherazade", sub: "Uthmani · Qur'an", stack: "'Scheherazade New', 'Amiri', serif" },
  { id: "noto-naskh", name: "Noto Naskh", sub: "Naskh · Modern", stack: "'Noto Naskh Arabic', 'Amiri', serif" },
  { id: "lateef", name: "Lateef", sub: "Naskh · Soft", stack: "'Lateef', 'Amiri', serif" },
  { id: "nastaliq", name: "Nastaliq", sub: "Indo-Pak · Urdu", stack: "'Gulzar', 'Noto Nastaliq Urdu', 'Amiri', serif", lh: 2.1 },
  { id: "reem-kufi", name: "Reem Kufi", sub: "Kufi · Geometric", stack: "'Reem Kufi', sans-serif" },
];

export const DEFAULT_SETTINGS = {
  lang: "both",
  theme: "pastel",
  appearance: "system",
  arabicFont: "amiri",
  translit: true,
  dhikrFieldOrder: DEFAULT_DHIKR_FIELD_ORDER,
  dhikrFieldVisible: DEFAULT_DHIKR_FIELD_VISIBLE,
  quickCollections: DEFAULT_QUICK_COLLECTIONS,
  homeSections: DEFAULT_HOME_SECTIONS,
  dailyGoal: 100,
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
  ],
  // Prayer times & Qibla. All times are computed on-device (adhan-js) from the
  // saved coordinates; only conventions vary. hijriOffset nudges the tabular
  // Umm al-Qura date to match local moon-sighting.
  prayer: {
    enabled: true,
    showOnHome: true,
    method: "auto",          // see CALC_METHODS
    madhhab: "shafi",        // shafi | hanafi (Asr)
    highLatRule: "auto",     // see HIGH_LAT_RULES
    hour12: true,
    location: { mode: "auto", lat: null, lng: null, label: "" },
    offsets: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    hijriOffset: 0,
    reminders: {
      enabled: false,
      before: 0,             // minutes before adhan
      prayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
    },
  },
};

export const THEMES = {
  classic: {
    name: "Sabḥa",
    dark: { "--bg": "#07140f", "--bg2": "#0a1d16", "--surface": "#0f2820", "--surface2": "#143729", "--line": "#1d4536", "--text": "#eaf4ee", "--muted": "#85a89a", "--primary": "#34b393", "--primary-dim": "#1c5e4c", "--gold": "#e0bd5c", "--danger": "#e07a6b" },
    light: { "--bg": "#f4efe1", "--bg2": "#efe8d5", "--surface": "#ffffff", "--surface2": "#faf5e9", "--line": "#e4dcc6", "--text": "#10302a", "--muted": "#6c8077", "--primary": "#16785f", "--primary-dim": "#bfe3d6", "--gold": "#b0851f", "--danger": "#c14a3a" },
  },
  // Pastel theme built around the "Tasbeeh Go" logo — cream + navy, teal "g",
  // coral "o", orange spark, lilac accents — paired with rounded Fredoka/Nunito.
  pastel: {
    name: "Tasbeeh Go",
    dark: { "--bg": "#131e3c", "--bg2": "#182549", "--surface": "#1f2e57", "--surface2": "#293a69", "--line": "#36477c", "--text": "#f6efe0", "--muted": "#9aa4c8", "--primary": "#5fc8ba", "--primary-dim": "#25454c", "--gold": "#f4b14e", "--danger": "#f3938a", "--font-display": "'Fredoka', sans-serif", "--font-body": "'Nunito', sans-serif" },
    light: { "--bg": "#faf2e4", "--bg2": "#f4e8d4", "--surface": "#fffdf8", "--surface2": "#fbf3e5", "--line": "#ece0cc", "--text": "#1f2c54", "--muted": "#8580a0", "--primary": "#2fab9b", "--primary-dim": "#c8ece6", "--gold": "#df9528", "--danger": "#e8786c", "--font-display": "'Fredoka', sans-serif", "--font-body": "'Nunito', sans-serif" },
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
  { id: "pastel", name: "Pastel", dark: ["#a6e3d8", "#62c9bb", "#2e9286"], gold: ["#ffd0c7", "#f3938a", "#c8675c"], front: ["#ffe7c4", "#f5b14e", "#c98a2c"], glow: "#f5b14e", thread: "#9d8ad0", arc: "#62c9bb" },
  { id: "sandalwood", name: "Sandalwood", dark: ["#9a7550", "#5a3a22", "#241208"], gold: ["#f2cd8a", "#c08a44", "#6a4418"], front: ["#ffe7b6", "#d99a48", "#7a4e1e"], glow: "#e0a85a", thread: "#3a2414", arc: "#c08a44" },
  { id: "amber", name: "Amber", dark: ["#c08a3a", "#6e451a", "#2e1c08"], gold: ["#ffd27a", "#e8a02e", "#8a5410"], front: ["#fff0b0", "#ffc04d", "#a86c18"], glow: "#ffb84d", thread: "#3a2810", arc: "#e8a02e" },
  { id: "jade", name: "Jade", dark: ["#5f9f86", "#1f5a45", "#0a2c20"], gold: ["#a6eccc", "#3fae86", "#16604a"], front: ["#dcffee", "#5fd6a6", "#1f7a5c"], glow: "#5fd6a6", thread: "#16463a", arc: "#3fae86" },
  { id: "pearl", name: "Pearl", dark: ["#c2ccd2", "#8a949b", "#4a5359"], gold: ["#ffffff", "#d6e2ea", "#9aa8b0"], front: ["#ffffff", "#eef6ff", "#b8ccda"], glow: "#dcecff", thread: "#5a646b", arc: "#acc4d6" },
  { id: "lapis", name: "Lapis", dark: ["#5577b8", "#243f78", "#0c1c40"], gold: ["#a6c4ff", "#4a78d8", "#1e3f8a"], front: ["#e2ecff", "#74a4ff", "#2a52aa"], glow: "#74a4ff", thread: "#1a2e58", arc: "#4a78d8" },
  { id: "ruby", name: "Ruby", dark: ["#b87474", "#7a2f2f", "#3a1414"], gold: ["#ffb4a4", "#d85a4a", "#7a2418"], front: ["#ffdccc", "#ff8a6a", "#a83c22"], glow: "#ff8a6a", thread: "#3e1a1a", arc: "#d85a4a" },
  { id: "amethyst", name: "Amethyst", dark: ["#9a78c0", "#5a3a86", "#2a1648"], gold: ["#d6b4ff", "#9a5ad8", "#5a2a9a"], front: ["#f0e0ff", "#bd84ff", "#6e2eb8"], glow: "#bd84ff", thread: "#341a52", arc: "#9a5ad8" },
  { id: "mono", name: "Mono", dark: ["#9a9a9a", "#3c3c3c", "#101010"], gold: ["#f2f2f2", "#bdbdbd", "#6a6a6a"], front: ["#ffffff", "#e2e2e2", "#8a8a8a"], glow: "#ffffff", thread: "#4a4a4a", arc: "#cfcfcf" },
];

export const STORAGE_VERSION = 9;
