import { isNative } from "../native/platform";

/* ─── Share card ─────────────────────────────────────────────────────────
   Draws a dhikr or a Name onto a 1080 x 1350 canvas (a portrait card that
   WhatsApp and Instagram show whole) in the reader's theme and Arabic
   typeface, and hands back a PNG. */
// Two layouts. The wallpaper keeps its text clear of the lock-screen clock
// at the top and the home bar at the bottom.
const FORMATS = {
  card: { W: 1080, H: 1350, side: 140, k: 1, grow: 1, frame: true, eyebrowY: 176, top: 230, bottom: (src) => (src ? 1105 : 1150), sourceY: 1150, markY: 1232 },
  wallpaper: { W: 1170, H: 2532, side: 150, k: 1.1, grow: 1.5, frame: false, eyebrowY: 1010, top: 1070, bottom: (src) => (src ? 2030 : 2090), sourceY: 2100, markY: 2300 },
};

const DISPLAY = '"Newsreader", "Amiri", Georgia, serif';
const BODY = '"Instrument Sans", "Amiri", system-ui, sans-serif';

// Lines that fit `max` pixels at the current font, split on spaces.
function wrap(ctx, text, max) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// At most `n` lines, ending with an ellipsis when cut.
function clamp(ctx, lines, n, max) {
  if (lines.length <= n) return lines;
  const out = lines.slice(0, n);
  let last = out[n - 1];
  while (last && ctx.measureText(`${last}…`).width > max) last = last.split(" ").slice(0, -1).join(" ");
  out[n - 1] = `${last}…`;
  return out;
}

async function fontsReady(specs) {
  try {
    await Promise.all(specs.map((s) => document.fonts.load(s)));
    await document.fonts.ready;
  } catch {
    // draw with whatever is available
  }
}

/* `vars` are the theme's CSS variables (--bg, --text, --muted, --gold, --line,
   --primary); `arabicStack` is the chosen Arabic font-family list. */
export async function renderShareCard({ eyebrow, arabic, title, meaning, source, vars, arabicStack, format = "card" }) {
  const F = FORMATS[format] || FORMATS.card;
  const { W, H, k } = F;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const c = { bg: vars["--bg"], ink: vars["--text"], muted: vars["--muted"], gold: vars["--gold"], line: vars["--line"], accent: vars["--primary"] };
  const arabicFont = (px) => `400 ${px}px ${arabicStack}`;
  await fontsReady([arabicFont(80), `italic 400 42px ${DISPLAY}`, `500 44px ${DISPLAY}`, `400 34px ${BODY}`, `600 26px ${BODY}`]);

  // Paper; the card adds a manuscript double rule, the wallpaper a small
  // gold star above the text.
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);
  if (F.frame) {
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.strokeStyle = c.gold;
    ctx.globalAlpha = 0.55;
    ctx.strokeRect(64, 64, W - 128, H - 128);
    ctx.globalAlpha = 1;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const max = W - F.side * 2;

  // One scale for all three texts: the largest at which the block fits. Text
  // is shown whole or not at all: past the smallest size the meaning, then
  // the transliteration, give way, and the Arabic is never cut.
  const top = F.top;
  const bottom = F.bottom(source);
  // On a wallpaper the star and label sit above the text, inside the same space.
  const lead = F.frame ? 0 : 150 * k;
  const layout = (sc, keepTitle, keepMeaning) => {
    const ar = Math.round(92 * k * sc);
    const tr = Math.round(42 * k * sc);
    const en = Math.round(34 * k * sc);
    ctx.direction = "rtl";
    ctx.font = arabicFont(ar);
    const arLines = wrap(ctx, arabic, max);
    ctx.direction = "ltr";
    ctx.font = `italic 400 ${tr}px ${DISPLAY}`;
    const trAll = keepTitle && title ? wrap(ctx, title, max) : [];
    const trLines = trAll.length <= 4 ? trAll : [];
    ctx.font = `400 ${en}px ${BODY}`;
    const enAll = keepMeaning && meaning ? wrap(ctx, meaning, max) : [];
    const enLines = enAll.length <= 5 ? enAll : [];
    const lead = { ar: ar * 1.75, tr: tr * 1.34, en: en * 1.46 };
    const gap = { tr: 36 * sc, en: 22 * sc };
    const h = arLines.length * lead.ar + (trLines.length ? gap.tr + trLines.length * lead.tr : 0) + (enLines.length ? gap.en + enLines.length * lead.en : 0);
    return { ar, tr, en, arLines, trLines, enLines, lead, gap, h };
  };
  let L;
  outer: for (const [keepTitle, keepMeaning] of [[true, true], [true, false], [false, false]]) {
    for (let sc = F.grow; sc >= 0.44; sc -= 0.04) {
      L = layout(sc, keepTitle, keepMeaning);
      if (L.h <= bottom - top - lead) break outer;
    }
  }
  // The card's label sits at the top of its frame. On a wallpaper the star and
  // label travel with the text, and the three are centred together.
  let y = top + Math.max(0, (bottom - top - L.h - lead) / 2) + lead;
  const eyebrowY = F.frame ? F.eyebrowY : y - 60 * k;
  if (!F.frame) {
    ctx.fillStyle = c.gold;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = ((i * 22.5 - 90) * Math.PI) / 180;
      const r = i % 2 ? 11 : 22;
      ctx[i ? "lineTo" : "moveTo"](W / 2 + r * Math.cos(a), eyebrowY - 78 + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
  }

  if (eyebrow) {
    ctx.font = `600 ${Math.round(26 * k)}px ${BODY}`;
    ctx.fillStyle = c.gold;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "4px";
    ctx.fillText(eyebrow.toUpperCase(), W / 2, eyebrowY);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  }

  ctx.direction = "rtl";
  ctx.font = arabicFont(L.ar);
  ctx.fillStyle = c.ink;
  for (const l of L.arLines) {
    ctx.fillText(l, W / 2, y + L.ar * 1.2);
    y += L.lead.ar;
  }
  ctx.direction = "ltr";

  if (L.trLines.length) {
    y += L.gap.tr;
    ctx.font = `italic 400 ${L.tr}px ${DISPLAY}`;
    ctx.fillStyle = c.ink;
    for (const l of L.trLines) {
      ctx.fillText(l, W / 2, y + L.tr);
      y += L.lead.tr;
    }
  }
  if (L.enLines.length) {
    y += L.gap.en;
    ctx.font = `400 ${L.en}px ${BODY}`;
    ctx.fillStyle = c.muted;
    for (const l of L.enLines) {
      ctx.fillText(l, W / 2, y + L.en);
      y += L.lead.en;
    }
  }

  if (source) {
    ctx.font = `400 ${Math.round(26 * k)}px ${BODY}`;
    ctx.fillStyle = c.muted;
    ctx.fillText(clamp(ctx, wrap(ctx, source, max), 1, max)[0], W / 2, F.sourceY);
  }

  // Wordmark: tasbeeh in ink, go in the accent, as in the app.
  ctx.font = `500 44px ${DISPLAY}`;
  const a = ctx.measureText("tasbeeh").width;
  ctx.font = `italic 500 44px ${DISPLAY}`;
  const b = ctx.measureText("go").width;
  const x0 = W / 2 - (a + b) / 2;
  ctx.textAlign = "left";
  ctx.font = `500 44px ${DISPLAY}`;
  ctx.fillStyle = c.ink;
  ctx.fillText("tasbeeh", x0, F.markY);
  ctx.font = `italic 500 44px ${DISPLAY}`;
  ctx.fillStyle = c.accent;
  ctx.fillText("go", x0 + a, F.markY);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  // What asked to be shown but did not fit.
  return { blob, left: [title && !L.trLines.length && "transliteration", meaning && !L.enLines.length && "meaning"].filter(Boolean) };
}

// Share through the system sheet where files are supported, else download.
export async function shareImage(blob, filename, text, download = false) {
  if (isNative) return (await import("../native/share")).nativeShareImage(blob, filename, text);
  const file = new File([blob], filename, { type: "image/png" });
  if (!download && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "shared";
    } catch (e) {
      if (e?.name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "saved";
}
