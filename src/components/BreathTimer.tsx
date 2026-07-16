'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Full-screen plank / breath timer. A pair of thin wavy lines rise from the
 * bottom over `duration` seconds (fading out as they near the top), and on
 * completion the label fades to "bravo!" and a "sljedeći korak" link
 * appears next to "ponovi".
 */

export interface BreathTimerProps {
  duration?: number; // seconds
  /** Field color. Default dark green. */
  fillTo?: string;
  /** 1 or 2 rising lines. */
  lines?: 1 | 2;
  /** Where "sljedeći korak" points once the timer finishes. */
  nextHref?: string;
  label?: string; // top-left label, e.g. "plank"
}

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export default function BreathTimer({
  duration = 30,
  fillTo = '#243027',
  lines = 2,
  nextHref = '/calendar',
  label = 'plank',
}: BreathTimerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const secsRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dprRef = useRef(1);
  const startTimeRef = useRef<number | null>(null);
  const fracRef = useRef(0);
  const wasDoneRef = useRef(false);

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const RESTING = 0.08;
  const fillRgb = hexToRgb(fillTo);

  const onStart = () => {
    startTimeRef.current = performance.now();
    setRunning(true);
    setDone(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawLine = (
      cfg: { off: number; amp: number; waves: number; sp: number; ph: number },
      surfaceY: number,
      t: number,
      W: number,
      H: number
    ) => {
      if (!ctx) return;
      const dpr = dprRef.current;
      const k = (Math.PI * 2 * cfg.waves) / W;
      const amp = cfg.amp * dpr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, surfaceY / (H * 0.22)));
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1 * dpr;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const x = (i / 120) * W;
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

    const draw = (now: number, p: number) => {
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgb(${fillRgb[0]},${fillRgb[1]},${fillRgb[2]})`;
      ctx.fillRect(0, 0, W, H);

      const surfaceY = H - p * H;
      drawLine({ off: 0, amp: 13, waves: 1.6, sp: 1.2, ph: 0 }, surfaceY, t, W, H);
      if (lines === 2) {
        drawLine({ off: 16, amp: 8, waves: 2.5, sp: 1.7, ph: 1.6 }, surfaceY, t, W, H);
      }
    };

    draw(performance.now(), RESTING);

    const loop = (now: number) => {
      const dur = duration * 1000;
      const secEl = secsRef.current;
      let frac = fracRef.current;
      if (running) {
        if (startTimeRef.current == null) startTimeRef.current = now;
        frac = Math.min((now - startTimeRef.current) / dur, 1);
        if (frac >= 1) {
          setRunning(false);
          setDone(true);
        }
      } else if (done) {
        frac = 1;
      } else {
        frac = 0;
      }
      if (!isFinite(frac)) frac = 0;
      fracRef.current = frac;

      const secs = Math.max(0, Math.ceil(duration * (1 - frac)));
      if (secEl) {
        if (done && !wasDoneRef.current) {
          wasDoneRef.current = true;
          secEl.style.transition = 'none';
          secEl.style.opacity = '0';
          secEl.textContent = 'bravo!';
          requestAnimationFrame(() => {
            secEl.style.transition = 'opacity .6s ease';
            secEl.style.opacity = '1';
          });
        } else if (!done) {
          if (wasDoneRef.current) {
            wasDoneRef.current = false;
            secEl.style.transition = 'none';
            secEl.style.opacity = '1';
          }
          secEl.textContent = String(secs);
        }
      }

      const p = RESTING + frac * (1 - RESTING);
      draw(now, p);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, done, duration, lines, fillTo]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: fillTo, overflow: 'hidden', fontFamily: "'Jost', system-ui, sans-serif" }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />

      <div style={{ position: 'absolute', top: 34, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 3 }}>
        <span style={{ fontWeight: 500, fontSize: 12, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#FFFFFF' }}>
          {label}
        </span>
        <span style={{ fontWeight: 500, fontSize: 12, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#CDF0B1' }}>
          {' '}
          &middot; {duration} sekundi
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(22px, 4vh, 42px)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={secsRef}
          style={{
            fontFamily: "'Marcellus', serif",
            fontSize: 20,
            color: '#EDEBE3',
            lineHeight: 1,
          }}
        >
          {duration}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
          <button
            onClick={onStart}
            style={{
              pointerEvents: running ? 'none' : 'auto',
              opacity: running ? 0 : 1,
              transition: 'opacity .5s ease',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#2C3A2C',
              background: '#CDF0B1',
              border: 'none',
              padding: '15px 34px',
              borderRadius: 100,
              cursor: 'pointer',
            }}
          >
            {done ? 'ponovi' : 'započni'}
          </button>

          <a
            href={nextHref}
            style={{
              pointerEvents: done ? 'auto' : 'none',
              opacity: done ? 1 : 0,
              transition: 'opacity .5s ease, margin-left .4s ease, padding .4s ease, width .4s ease',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#EDEBE3',
              background: 'none',
              border: '1px solid rgba(237,235,227,0.55)',
              padding: done ? '15px 34px' : '0px',
              borderRadius: 100,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              marginLeft: done ? 14 : 0,
              width: done ? 'auto' : 0,
              boxSizing: 'border-box',
            }}
          >
            sljedeći korak
          </a>
        </div>
      </div>
    </div>
  );
}
