"use client";

import { useEffect, useRef } from "react";

/**
 * Small ambient preview of the BreathTimer's wavy-line animation, used as a
 * hint inside the "Plank" nav card. Transparent background, fixed height —
 * only the wave itself animates. Loops continuously, purely decorative.
 */
export default function BreathTimerPreview({
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
    window.addEventListener("resize", resize);

    const drawLine = (
      cfg: { off: number; amp: number; waves: number; sp: number; ph: number },
      surfaceY: number,
      t: number,
      W: number
    ) => {
      const dpr = dprRef.current;
      const k = (Math.PI * 2 * cfg.waves) / W;
      const amp = cfg.amp * dpr;
      ctx.save();
      ctx.strokeStyle = "#EDEBE3";
      ctx.lineWidth = 1 * dpr;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = (i / 80) * W;
        const y =
          surfaceY +
          cfg.off * dpr +
          amp * Math.sin(x * k + t * cfg.sp + cfg.ph) +
          amp * 0.4 * Math.sin(x * k * 2.3 + t * cfg.sp * 1.4 + cfg.ph);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const loop = (now: number) => {
      const W = canvas.width;
      const H = canvas.height;
      const t = now / 1000;

      ctx.clearRect(0, 0, W, H);

      const surfaceY = H * 0.5;
      drawLine({ off: 0, amp: 8, waves: 1.6, sp: 1.2, ph: 0 }, surfaceY, t, W);
      drawLine(
        { off: 10, amp: 5, waves: 2.5, sp: 1.7, ph: 1.6 },
        surfaceY,
        t,
        W
      );

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
