const CACHE_NAME = "sabha-v4";
const ALERT_CACHE = "sabha-alerts";
const ASSETS = [
  "/",
  "/index.html",
  "/favicon.svg",
  "/manifest.json"
];

// ─── Install ─────────────────────────────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== ALERT_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch (Offline support – stale-while-revalidate) ────────────────
self.addEventListener("fetch", (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});

// ─── Message handler — receive alert configs from the app ────────────
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (e.data && e.data.type === "SYNC_ALERTS") {
    const { alerts, enabled } = e.data;
    // Store alert config in a dedicated cache so the SW can access it independently
    caches.open(ALERT_CACHE).then((cache) => {
      const payload = JSON.stringify({ alerts: alerts || [], enabled: !!enabled });
      const response = new Response(payload, {
        headers: { "Content-Type": "application/json" }
      });
      cache.put("/_alerts_config", response);
    });
  }
});

// ─── Periodic Background Sync (Android Chrome) ──────────────────────
self.addEventListener("periodicsync", (e) => {
  if (e.tag === "sabha-alert-check") {
    e.waitUntil(checkAndFireAlerts());
  }
});

// ─── Self-contained alert checking logic ────────────────────────────
async function checkAndFireAlerts() {
  try {
    const cache = await caches.open(ALERT_CACHE);
    const configResponse = await cache.match("/_alerts_config");
    if (!configResponse) return;

    const { alerts, enabled } = await configResponse.json();
    if (!enabled || !alerts || alerts.length === 0) return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const timeStr = `${h}:${m}`;
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Load fired-today map from cache
    const firedResponse = await cache.match("/_alerts_fired");
    let firedMap = {};
    if (firedResponse) {
      try { firedMap = await firedResponse.json(); } catch (_) {}
    }

    let didFire = false;

    for (const alert of alerts) {
      if (!alert.enabled || alert.time !== timeStr) continue;

      const firedKey = `${alert.id}_${today}`;
      if (firedMap[firedKey]) continue;

      // Build deep link
      let deepLink = "/";
      if (alert.targetType === "dhikr" && alert.targetId) {
        deepLink = `/counter?dhikr=${alert.targetId}`;
      } else if (alert.targetType === "list" && alert.targetId) {
        deepLink = `/counter?list=${alert.targetId}`;
      }

      await self.registration.showNotification(alert.title, {
        body: alert.body || "It's time for your dhikr recitations.",
        icon: "/favicon.svg",
        vibrate: [200, 100, 200],
        badge: "/favicon.svg",
        tag: `sabha-${alert.id}`,
        data: { url: deepLink },
        actions: [
          { action: "open", title: "Begin" },
          { action: "dismiss", title: "Later" }
        ]
      });

      firedMap[firedKey] = true;
      didFire = true;
    }

    // Persist updated fired map
    if (didFire) {
      // Clean old entries (keep only today)
      const cleanedMap = {};
      for (const [key, val] of Object.entries(firedMap)) {
        if (key.endsWith(`_${today}`)) {
          cleanedMap[key] = val;
        }
      }
      const firedPayload = new Response(JSON.stringify(cleanedMap), {
        headers: { "Content-Type": "application/json" }
      });
      await cache.put("/_alerts_fired", firedPayload);
    }
  } catch (err) {
    console.warn("[SW] Alert check failed:", err);
  }
}

// ─── Notification Click — deep linking ──────────────────────────────
self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  if (e.action === "dismiss") return;

  const targetUrl = (e.notification.data && e.notification.data.url) ? e.notification.data.url : "/";
  const absoluteTargetUrl = new URL(targetUrl, self.location.origin).href;

  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          if ("navigate" in client) {
            client.navigate(absoluteTargetUrl).catch(() => {});
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(absoluteTargetUrl);
      }
    })
  );
});
