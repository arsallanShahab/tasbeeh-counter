import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

/* The app's vibration calls, played on the phone's own haptic engine. Takes
   the same patterns the web version does: 8 a count, 5 or 6 a soft tap, the
   [.., 38, ..] array a completed target, and { pattern } presets for the
   step rhythms (see utils/haptics). */
export function nativeHaptic(pattern) {
  try {
    if (pattern === 8) return Haptics.impact({ style: ImpactStyle.Light });
    if (pattern === 5 || pattern === 6) return Haptics.impact({ style: ImpactStyle.Light });
    if (Array.isArray(pattern) && pattern.includes(38)) return Haptics.notification({ type: NotificationType.Success });
    if (pattern?.pattern) {
      let at = 0;
      for (const v of pattern.pattern) {
        at += v.delay || 0;
        const style = v.duration >= 30 ? ImpactStyle.Medium : ImpactStyle.Light;
        setTimeout(() => Haptics.impact({ style }), at);
        at += v.duration;
      }
      return;
    }
    return Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // no haptic engine: nothing to do
  }
}
