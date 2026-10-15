import { useApp } from "../context/AppContext";
import { useNow } from "./useNow";
import { detectOccasions } from "../utils/hijri";
import { hijriDisplayOffset, hijriNightOffset } from "../utils/prayerTimes";

// Today's occasions, each with the set it leads with; ticks so Maghrib rolls the day.
export const useOccasions = () => {
  const { settings, lists } = useApp();
  const d = new Date(useNow(60000));
  const night = hijriNightOffset(settings.prayer, d);
  return detectOccasions(d, hijriDisplayOffset(settings.prayer, d), night)
    .map((o) => ({ ...o, set: lists.find((l) => l.id === o.setId) || null }))
    .filter((o) => o.set);
};
