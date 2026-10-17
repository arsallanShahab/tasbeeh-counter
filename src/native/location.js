import { Geolocation } from "@capacitor/geolocation";

// The device location for prayer times, with the system's own permission prompt.
export async function nativePosition() {
  const perm = await Geolocation.checkPermissions().catch(() => null);
  if (perm && perm.location !== "granted" && perm.coarseLocation !== "granted") {
    const asked = await Geolocation.requestPermissions({ permissions: ["coarseLocation"] });
    if (asked.location !== "granted" && asked.coarseLocation !== "granted") {
      throw Object.assign(new Error("Location permission was not given."), { code: 1 });
    }
  }
  const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 });
  return { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
}
