import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";

/* App-only wiring, loaded once at start inside the native app. */
export function setupNative() {
  // Android's back button steps back through the app's history (sheets
  // included, see Modal's back-to-close). With nothing behind a screen, as
  // when the app reopens on the counter, Back goes to Today; from Today it
  // leaves the app.
  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) window.history.back();
    else if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else App.exitApp();
  });
}

// The status bar takes the page colour, with icons that read on it.
export function paintStatusBar(bg, dark) {
  StatusBar.setBackgroundColor({ color: bg }).catch(() => {});
  StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
}

// Fires when the app returns to the foreground.
export function onResume(fn) {
  const handle = App.addListener("resume", fn);
  return () => handle.then((h) => h.remove());
}
