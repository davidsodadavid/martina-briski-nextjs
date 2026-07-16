"use client";

import { useEffect, useRef } from "react";

/**
 * Small ambient preview of the AudioPractice player, used as a hint inside
 * the "Vođena praksa" nav card. A single wobbly, asymmetric ring (same
 * distortion technique as BreathingCirclePreview) grows outward from a
 * small (never a dot) starting size until it nears the card's edge —
 * without overflowing past it — then shrinks back down to that same small
 * size at the same speed and repeats — line-only (no fills), same
 * dpr-scaled ~1px stroke weight as BreathTimerPreview/BreathingCirclePreview
 * for visual consistency across the three practice cards. Transparent
 * background, loops continuously. Uses a ResizeObserver (not just a window
 * resize listener) so the canvas's internal resolution always matches its
 * actual rendered size, even if the card's layout settles after mount.
 */
export default function AudioPracticePreview({
  className,
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const GROW_DURATION = 2.5;
    const SHRINK_DURATION = 2.5;
    const PERIOD = GROW_DURATION + SHRINK_DURATION;

    const loop = (now: number) => {
      const t = now / 1000;
      const dpr = dprRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      // Stops well shy of the card's nearest edge (accounting for the
      // wobble's extra reach) so it never overflows past the card.
      const maxR = (Math.min(W, H) / 2) * 0.576;
      // Never shrinks all the way to a dot — floors out at a small but
      // visible circle, and grows from that same floor.
      const minR = maxR * 0.3;

      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1 * dpr;
      ctx.strokeStyle = "#EDEBE3";

      const NUM_POINTS = 96;

      const tInCycle = t % PERIOD;
      const growing = tInCycle < GROW_DURATION;
      const baseR = growing
        ? minR + (tInCycle / GROW_DURATION) * (maxR - minR)
        : minR + (1 - (tInCycle - GROW_DURATION) / SHRINK_DURATION) * (maxR - minR);
      ctx.beginPath();
      for (let p = 0; p <= NUM_POINTS; p++) {
        const angle = (Math.PI * 2 * p) / NUM_POINTS;
        const wobble =
          Math.sin(angle * 3 + t * 0.6) * baseR * 0.12 +
          Math.sin(angle * 5 - t * 0.4) * baseR * 0.06;
        const r = baseR + wobble;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
