"use client";

import { useEffect, useRef } from "react";

/**
 * Small ambient preview of the BreathingCircle animation, used as a hint
 * inside the "Ritam disanja za smireni um" nav card. A single circle
 * outline that drifts around the card while pulsing (growing/shrinking)
 * on the same inhale/exhale cycle as the real page. Transparent
 * background, card height never changes. Loops continuously.
 */
export default function BreathingCirclePreview({
  inhaleSeconds = 6,
  exhaleSeconds = 6,
  className,
}: {
  inhaleSeconds?: number;
  exhaleSeconds?: number;
  className?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const NUM_POINTS = 96;
    const baseRadius = 65;
    const inhaleMs = inhaleSeconds * 1000;
    const exhaleMs = exhaleSeconds * 1000;
    const cycleMs = inhaleMs + exhaleMs;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      const tInCycle = (elapsed * 1000) % cycleMs;
      const inhaling = tInCycle < inhaleMs;
      const breath = inhaling
        ? tInCycle / inhaleMs
        : 1 - (tInCycle - inhaleMs) / exhaleMs;

      // Center sits mostly above the card, so only the lower arc of this
      // much bigger circle peeks into view near the top as it breathes.
      const cx = 50 + 35 * Math.sin(elapsed / 7);
      const cy = -28 + 10 * Math.cos(elapsed / 5.3);

      const points: [number, number][] = [];
      for (let i = 0; i <= NUM_POINTS; i++) {
        const angle = (Math.PI * 2 * i) / NUM_POINTS;
        const wave = Math.sin(angle * 4 + elapsed);
        const r = baseRadius + wave * 5 + breath * 24;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      let d = `M${points[0][0]},${points[0][1]}`;
      for (let i = 1; i < points.length; i++) {
        d += ` L${points[i][0]},${points[i][1]}`;
      }
      path.setAttribute("d", d);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inhaleSeconds, exhaleSeconds]);

  return (
    <svg viewBox="0 0 100 50" className={className}>
      <path
        ref={pathRef}
        fill="none"
        stroke="#EDEBE3"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
