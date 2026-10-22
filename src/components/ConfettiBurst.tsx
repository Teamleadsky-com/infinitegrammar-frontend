import { useMemo } from "react";

// A short confetti burst for a perfect exercise: small shards in the brand colors fly out of the
// score and fade. Pure CSS (keyframes "confetti-burst" in tailwind.config.ts); nothing is shown when
// the learner prefers reduced motion.

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary-glow))",
  "hsl(var(--success))",
  "hsl(78 90% 55%)", // lime
  "hsl(38 92% 55%)", // amber
];

type Piece = { dx: number; dy: number; rot: number; delay: number; color: string; round: boolean; w: number; h: number };

const makePieces = (count: number): Piece[] =>
  Array.from({ length: count }, (_, i) => {
    // a fan that opens upwards and to the sides, then falls a little
    const angle = (-170 + (160 * i) / (count - 1) + (Math.random() * 14 - 7)) * (Math.PI / 180);
    const distance = 70 + Math.random() * 110;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance + 40 + Math.random() * 30,
      rot: Math.random() * 540 - 270,
      delay: Math.random() * 90,
      color: COLORS[i % COLORS.length],
      round: i % 3 === 0,
      w: i % 3 === 0 ? 7 : 5,
      h: i % 3 === 0 ? 7 : 11,
    };
  });

/** `className` places the origin of the burst inside a relative container (default: its center). */
export const ConfettiBurst = ({ count = 28, className = "left-1/2 top-1/2" }: { count?: number; className?: string }) => {
  const pieces = useMemo(() => makePieces(count), [count]);
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute h-0 w-0 motion-reduce:hidden ${className}`} data-testid="confetti-burst">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 animate-confetti-burst"
          style={{
            width: p.w,
            height: p.h,
            background: p.color,
            borderRadius: p.round ? 9999 : 2,
            animationDelay: `${p.delay}ms`,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
            ["--rot" as string]: `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
};

/** A green check badge that pops in and draws its tick. */
export const SuccessCheck = () => (
  <div data-testid="success-check" className="relative z-10 mx-auto mb-3 h-14 w-14 rounded-full bg-success text-success-foreground shadow-lg shadow-success/30 grid place-items-center animate-pop-in motion-reduce:animate-none">
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} className="animate-draw-check motion-reduce:animate-none [stroke-dasharray:1] [stroke-dashoffset:1] motion-reduce:[stroke-dashoffset:0]" />
    </svg>
  </div>
);
