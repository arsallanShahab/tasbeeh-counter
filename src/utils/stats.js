export const dateKey = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const fmt = (n) => (n ?? 0).toLocaleString();

export function computeStreak(byDate) {
  if (!byDate) return 0;
  let streak = 0;
  const d = new Date();
  // If no entry for today, check starting from yesterday
  if (!byDate[dateKey(d)]) {
    d.setDate(d.getDate() - 1);
  }
  while (byDate[dateKey(d)] > 0) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function bestStreak(byDate) {
  if (!byDate) return 0;
  const keys = Object.keys(byDate).filter((k) => byDate[k] > 0).sort();
  let best = 0;
  let cur = 0;
  let prev = null;
  
  for (const k of keys) {
    if (prev) {
      const pd = new Date(prev);
      const cd = new Date(k);
      // Difference of 1 day in milliseconds
      cur = (cd - pd) === 86400000 ? cur + 1 : 1;
    } else {
      cur = 1;
    }
    best = Math.max(best, cur);
    prev = k;
  }
  return best;
}

export function last7(byDate) {
  const out = [];
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      key: dateKey(d),
      label: daysOfWeek[d.getDay()],
      count: (byDate && byDate[dateKey(d)]) || 0
    });
  }
  return out;
}
