import { useId } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { BrandMark } from "../common/BrandMark";

// An eight-pointed star, for the faint pattern behind the welcome.
const star = (cx, cy, ro = 12, ri = 7) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = ((i * 22.5 - 90) * Math.PI) / 180;
    const r = i % 2 ? ri : ro;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
const TILE = 56;

// The faint star pattern that fades down the top of the setup screens.
export const StarPattern = ({ className = "", opacity = 0.1 }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 w-full text-accent [mask-image:linear-gradient(to_bottom,black,transparent_88%)] ${className}`}>
      <defs>
        <pattern id={id} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
          {[[TILE / 2, TILE / 2], [0, 0], [TILE, 0], [0, TILE], [TILE, TILE]].map(([x, y]) => (
            <polygon key={`${x}-${y}`} points={star(x, y)} fill="none" stroke="currentColor" strokeWidth="1" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
};

// A soft moon halo with a thin gold double ring, like a manuscript border; children sit in its centre.
export const Halo = ({ size, children, className = "" }) => (
  <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_12%,var(--bg2)),var(--bg2)_65%,transparent)]" />
    <span aria-hidden="true" className="absolute inset-0 rounded-full border border-[color-mix(in_srgb,var(--gold)_45%,transparent)]" />
    <span aria-hidden="true" className="absolute inset-[5%] rounded-full border border-[color-mix(in_srgb,var(--gold)_22%,transparent)]" />
    <span className="relative">{children}</span>
  </span>
);

const ease = [0.22, 1, 0.36, 1];
// The welcome settles in once: picture first, then the words, then the button.
const enter = (i) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.2 + i * 0.09, ease } } });

export default function Welcome({ questions, onBegin, onSkip }) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <StarPattern className="h-[72%]" />

      <header className="relative flex h-14 shrink-0 items-center justify-between px-5">
        <BrandMark size="sm" />
        <button type="button" onClick={onSkip} className="min-h-11 rounded-lg px-2 text-sm font-medium text-muted hover:text-ink">
          Skip
        </button>
      </header>

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="relative flex items-end justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease } }}
        >
          {/* A moon halo with a thin gold double ring, like a manuscript border. */}
          <span aria-hidden="true" className="absolute left-1/2 top-[46%] aspect-square w-[min(19rem,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_12%,var(--bg2)),var(--bg2)_65%,transparent)]" />
          <span aria-hidden="true" className="absolute left-1/2 top-[46%] aspect-square w-[min(19rem,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_srgb,var(--gold)_45%,transparent)]" />
          <span aria-hidden="true" className="absolute left-1/2 top-[46%] aspect-square w-[min(17.5rem,74vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_srgb,var(--gold)_22%,transparent)]" />
          <img
            src="/intro-onboard.webp"
            alt=""
            width={720}
            height={783}
            decoding="async"
            fetchPriority="high"
            className="relative h-auto w-[min(16.5rem,66vw)] max-h-[34svh] object-contain"
          />
        </motion.div>

        <h1 id="ob-title" className="mt-[clamp(1.75rem,5svh,2.75rem)] outline-none">
          <motion.span {...enter(0)} lang="ar" dir="rtl" className="block font-arabic text-[3rem] leading-[1.5] text-ink">
            السَّلَامُ عَلَيْكُمْ
          </motion.span>
          <motion.span {...enter(1)} className="mt-1 block font-display text-[1.625rem] leading-tight italic text-ink">
            Assalamu alaikum
          </motion.span>
        </h1>
        <motion.p {...enter(2)} className="mt-4 max-w-[30ch] text-base leading-relaxed text-muted">
          A quiet companion for your daily dhikr.
        </motion.p>
        <motion.p {...enter(3)} className="eyebrow mt-6 flex items-center gap-2.5">
          <span>{questions} short questions</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-gold" />
          <span>About a minute</span>
        </motion.p>
      </div>

      <motion.footer {...enter(4)} className="relative mx-auto w-full max-w-md shrink-0 px-6 pt-4 pb-6">
        <Button size="lg" block iconRight={ArrowRight} onClick={onBegin}>
          Begin
        </Button>
      </motion.footer>
    </div>
  );
}
