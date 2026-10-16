import { useApp } from "../context/AppContext";
import { useNow } from "./useNow";
import { detectOccasions } from "../utils/hijri";
import { hijriDisplayOffset, hijriNightOffset } from "../utils/prayerTimes";
import { lastThird } from "../utils/duaTimes";

// Today's occasions, each with the set it leads with; ticks so Maghrib rolls the day.
export const useOccasions = () => {
  const { settings, lists } = useApp();
  const d = new Date(useNow(60000));
  const night = hijriNightOffset(settings.prayer, d);
  const lt = lastThird(settings.prayer, d);
  const tahajjud =
    lt && d >= lt.start && d < lt.end
      ? [{
          id: "last-third",
          label: "The last third of the night",
          desc: "Our Lord descends each night when the last third remains and says: Who is calling upon Me, that I may answer him? (Bukhari 1145)",
          icon: "moon",
          setId: "tahajjud",
          browse: "night",
          duas: true,
        }]
      : [];
  return [...tahajjud, ...detectOccasions(d, hijriDisplayOffset(settings.prayer, d), night)]
    .map((o) => ({ ...o, set: lists.find((l) => l.id === o.setId) || null }))
    .filter((o) => o.set);
};
