"use client";

import { useEffect, useRef } from "react";

export interface BreathingCircleProps {
  /** Seconds spent breathing in. Default 6. */
  inhaleSeconds?: number;
  /** Seconds spent breathing out. Default 6. */
  exhaleSeconds?: number;
  /** Field color. Default matches the site's sage green. */
  background?: string;
  /** Circle / text color. Default cream. */
  ink?: string;
  /** Top-left label, e.g. "disanje". */
  label?: string;
}

export default function BreathingCircle({
  inhaleSeconds = 6,
  exhaleSeconds = 6,
  background = "#5F6D6A",
  ink = "#EDEBE3",
  label = "disanje",
}: BreathingCircleProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const phaseRef = useRef<SVGTextElement>(null);
  const startRef = useRef(0);
  const lastPhaseRef = useRef(-1);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const NUM_POINTS = 128;
    const inhaleMs = inhaleSeconds * 1000;
    const exhaleMs = exhaleSeconds * 1000;
    const cycleMs = inhaleMs + exhaleMs;

    function getRadius() {
      const w = window.innerWidth;
      if (w <= 480) return 100;
      if (w <= 768) return 120;
      return 140;
    }

    let baseRadius = getRadius();

    const handleResize = () => {
      baseRadius = getRadius();
    };
    window.addEventListener("resize", handleResize);

    startRef.current = performance.now();

    function animate(now: number) {
      if (!path) return;
      const elapsed = (now - startRef.current) / 1000;
      const tInCycle = (elapsed * 1000) % cycleMs;

      const inhaling = tInCycle < inhaleMs;
      const breath = inhaling
        ? tInCycle / inhaleMs
        : 1 - (tInCycle - inhaleMs) / exhaleMs;

      const phase = inhaling ? 0 : 1;
      if (phase !== lastPhaseRef.current) {
        lastPhaseRef.current = phase;
        if (phaseRef.current) {
          phaseRef.current.textContent = inhaling ? "udahni" : "izdahni";
        }
      }

      const points: [number, number][] = [];
      for (let i = 0; i <= NUM_POINTS; i++) {
        const angle = (Math.PI * 2 * i) / NUM_POINTS;
        const wave = Math.sin(angle * 4 + elapsed);
        const r = baseRadius + wave * 8 + breath * 40;
        points.push([r * Math.cos(angle) * 0.8, r * Math.sin(angle) * 1.1]);
      }

      let d = `M${points[0][0]},${points[0][1]}`;
      for (let i = 1; i < points.length; i++) {
        d += ` L${points[i][0]},${points[i][1]}`;
      }
      path.setAttribute("d", d);

      raf = requestAnimationFrame(animate);
    }

    let raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [inhaleSeconds, exhaleSeconds]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background,
        overflow: "hidden",
        fontFamily: "'Jost', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: ink,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#CDF0B1",
          }}
        >
          {" "}
          &middot; {inhaleSeconds}s udah / {exhaleSeconds}s izdah
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 400 400"
          style={{ width: "min(80vw, 420px)", height: "min(80vw, 420px)" }}
        >
          <g transform="translate(200, 200)">
            <path
              ref={pathRef}
              fill="none"
              stroke={ink}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              ref={phaseRef}
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ink}
              fontFamily="'Marcellus', serif"
              fontSize="20"
            >
              udahni
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
