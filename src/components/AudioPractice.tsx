'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Audio-reactive guided-practice player — centered layout (mirrors the
 * Breath Timer treatment: label top, title + play button + progress
 * stacked in the middle). Soft "stars" spawn on a dark green field at all
 * times — slow ambient drift when idle, denser while playing — each
 * fading in, twinkling, then fading out over its own lifespan; volume
 * nudges their size only while audio is actually playing.
 */

type Star = {
  x: number;
  y: number;
  r: number;
  born: number;
  life: number;
  driftX: number;
  driftY: number;
};

export interface AudioPracticeProps {
  src: string;
  title?: string;
  subtitle?: string;
  /** Background color. Default matches the dark-green palette. */
  background?: string;
  /** Star / accent ink color. Default white. */
  ink?: string;
  /** Label color (top caption + progress fill). Default light green. */
  accent?: string;
  /** Fill the nearest positioned ancestor edge-to-edge instead of rendering as a bounded card. */
  fullScreen?: boolean;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss < 10 ? '0' : ''}${ss}`;
}

export default function AudioPractice({
  src,
  title = 'Opuštanje',
  subtitle = '9 min · vođena praksa',
  background = '#243027',
  ink = '#FFFFFF',
  accent = '#D3F9B5',
  fullScreen = false,
}: AudioPracticeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const srcNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const starsRef = useRef<Star[]>([]);
  const lastSpawnRef = useRef(0);
  const levelRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const dprRef = useRef(1);

  const [playing, setPlaying] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [timeLabel, setTimeLabel] = useState(`0:00 / 0:00`);

  const inkRgb = hexToRgb(ink);

  const ensureAnalyser = () => {
    if (srcNodeRef.current || !audioRef.current) return;
    if (!acRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      acRef.current = new Ctx();
    }
    try {
      const ac = acRef.current;
      const srcNode = ac.createMediaElementSource(audioRef.current);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 128;
      srcNode.connect(analyser);
      analyser.connect(ac.destination);
      srcNodeRef.current = srcNode;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch {
      // already connected, or unsupported — visuals still idle-animate
    }
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (acRef.current?.state === 'suspended') acRef.current.resume();
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      ensureAnalyser();
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');

    const loop = (now: number) => {
      const t = now / 1000;
      const dpr = dprRef.current;

      let lvl = 0;
      if (analyserRef.current && dataRef.current && playing) {
        analyserRef.current.getByteFrequencyData(dataRef.current);
        let sum = 0;
        for (let i = 0; i < dataRef.current.length; i++) sum += dataRef.current[i];
        lvl = sum / dataRef.current.length / 255;
      }
      levelRef.current = levelRef.current * 0.82 + lvl * 0.18;
      const e = levelRef.current;

      if (ctx) {
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // spawn continuously — faster/denser while playing, gentle ambient drift while idle
        const spawnInterval = playing ? 0.18 : 0.5;
        if (t - lastSpawnRef.current > spawnInterval && starsRef.current.length < 60) {
          lastSpawnRef.current = t;
          starsRef.current.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: 1 + Math.random() * 2.2,
            born: t,
            life: 4 + Math.random() * 3,
            driftX: (Math.random() - 0.5) * 50 * dpr,
            driftY: -(20 + Math.random() * 50) * dpr,
          });
        }
        starsRef.current = starsRef.current.filter((s) => t - s.born < s.life);
        starsRef.current.forEach((s) => {
          const age = t - s.born;
          const f = age / s.life;
          let op: number;
          if (f < 0.18) op = f / 0.18;
          else if (f > 0.65) op = Math.max(0, 1 - (f - 0.65) / 0.35);
          else op = 1;
          const x = s.x + s.driftX * f;
          const y = s.y + s.driftY * f;
          const twinkle = 0.7 + 0.3 * Math.sin(t * 3 + s.x);
          ctx.beginPath();
          ctx.arc(x, y, s.r * (1 + e * 1.4) * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${inkRgb[0]},${inkRgb[1]},${inkRgb[2]},${op * twinkle})`;
          ctx.fill();
        });
      }

      // progress + time readout
      const audio = audioRef.current;
      if (audio) {
        const total = audio.duration && isFinite(audio.duration) ? audio.duration : 0;
        setProgressPct(total ? Math.min(100, (audio.currentTime / total) * 100) : 0);
        setTimeLabel(`${fmt(audio.currentTime)} / ${fmt(total)}`);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    return () => {
      acRef.current?.close();
    };
  }, []);

  return (
    <div
      style={
        fullScreen
          ? {
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              background,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: "'Jost', system-ui, sans-serif",
            }
          : {
              width: '100%',
              maxWidth: 1040,
              height: 560,
              borderRadius: 16,
              overflow: 'hidden',
              background,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 30px 60px -34px rgba(46,42,36,0.5)',
              fontFamily: "'Jost', system-ui, sans-serif",
            }
      }
    >
      <div
        style={{
          position: 'absolute',
          top: 34,
          left: 0,
          right: 0,
          zIndex: 2,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {' '}
            &middot; {subtitle}
          </span>
        )}
      </div>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30,
          padding: 24,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            opacity: playing ? 0 : 1,
            transition: 'opacity .5s ease',
          }}
        >
          <div style={{ fontFamily: "'Marcellus', serif", fontSize: 20, color: '#F1F1F1' }}>{title}</div>
        </div>

        <button
          onClick={toggle}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '1px solid rgba(237,235,227,0.45)',
            background: 'none',
            color: '#F1F1F1',
            cursor: 'pointer',
            fontSize: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {playing ? '❙❙' : '▶'}
        </button>

        <div style={{ width: 260 }}>
          <div style={{ height: 2, background: 'rgba(237,235,227,0.22)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: accent }} />
          </div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.06em',
              color: 'rgba(237,235,227,0.7)',
              marginTop: 10,
              textAlign: 'center',
            }}
          >
            {timeLabel}
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
