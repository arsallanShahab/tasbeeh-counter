export const store = {
  get(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.warn("Storage read failed for key:", key, e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write failed for key:", key, e);
    }
  },
  // The stored text as is, or null when the key is missing or storage is unavailable.
  getRaw(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  // Returns false when the browser refuses the write (full, or a private window).
  setRaw(key, raw) {
    try {
      localStorage.setItem(key, raw);
      return true;
    } catch (e) {
      console.warn("Storage write failed for key:", key, e);
      return false;
    }
  },
};
