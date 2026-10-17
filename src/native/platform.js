import { Capacitor } from "@capacitor/core";

// True inside the Android or iOS app; false on the web, where nothing changes.
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // "web" | "android" | "ios"
