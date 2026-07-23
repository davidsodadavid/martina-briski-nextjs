"use client";

import { useEffect, useRef, useState } from "react";

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
  /** Whether to show the top label ("disanje · Xs udah / Xs izdah"). Default true. */
  showLabel?: boolean;
  /** Delay (ms) before the label fades in. Default 0 (shows immediately). */
  labelRevealDelayMs?: number;
  /** Scales the rendered circle's size (and its container) up or down. Default 1. */
  sizeScale?: number;
  /** Font size (px) of the centered "udahni"/"izdahni" text. Default 20. */
  phaseFontSize?: number;
  /** Cross-fade the "udahni"/"izdahni" text instead of swapping it instantly. Default false. */
  phaseFade?: boolean;
  /** Seconds to hold the circle at full expansion after inhaling, before it
   * starts to shrink. No text is shown during the hold. Default 0 (no hold). */
  holdSeconds?: number;
  /** Seconds to rest at full contraction after exhaling, before it starts
   * to grow again. No text is shown during the rest. Default 0 (no rest). */
  restSeconds?: number;
}

export default function BreathingCircle({
  inhaleSeconds = 6,
  exhaleSeconds = 6,
  background = "#5F6D6A",
  ink = "#EDEBE3",
  label = "disanje",
  showLabel = true,
  labelRevealDelayMs = 0,
  sizeScale = 1,
  phaseFontSize = 20,
  phaseFade = false,
  holdSeconds = 0,
  restSeconds = 0,
}: BreathingCircleProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const phaseRef = useRef<SVGTextElement>(null);
  const startRef = useRef(0);
  const lastPhaseRef = useRef<"inhale" | "hold" | "exhale" | "rest" | null>(
    null,
  );
  const preFadeStartedRef = useRef(false);
  const preColorFadeStartedRef = useRef(false);
  const [labelVisible, setLabelVisible] = useState(labelRevealDelayMs === 0);

  useEffect(() => {
    if (labelRevealDelayMs === 0) return;
    const t = setTimeout(() => setLabelVisible(true), labelRevealDelayMs);
    return () => clearTimeout(t);
  }, [labelRevealDelayMs]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const NUM_POINTS = 128;
    const TEXT_FADE_MS = 1400;
    const COLOR_FADE_MS = 400;
    const PAUSE_COLOR = "#CDF0B1";
    const inhaleMs = inhaleSeconds * 1000;
    const holdMs = holdSeconds * 1000;
    const exhaleMs = exhaleSeconds * 1000;
    const restMs = restSeconds * 1000;
    const cycleMs = inhaleMs + holdMs + exhaleMs + restMs;

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
      const holding = !inhaling && tInCycle < inhaleMs + holdMs;
      const exhaling =
        !inhaling && !holding && tInCycle < inhaleMs + holdMs + exhaleMs;
      const breath = inhaling
        ? tInCycle / inhaleMs
        : holding
          ? 1
          : exhaling
            ? 1 - (tInCycle - inhaleMs - holdMs) / exhaleMs
            : 0;

      const phase = inhaling
        ? "inhale"
        : holding
          ? "hold"
          : exhaling
            ? "exhale"
            : "rest";
      if (phase !== lastPhaseRef.current) {
        const prevPhase = lastPhaseRef.current;
        lastPhaseRef.current = phase;
        preFadeStartedRef.current = false;
        preColorFadeStartedRef.current = false;

        // stroke color: eased to a light green during the hold/rest pause
        // (already faded in during the tail of the previous phase, see the
        // pre-fade check below) and eased back to the normal ink color once
        // the pause ends
        if (phase === "hold" || phase === "rest") {
          path.style.transition = "none";
          path.style.stroke = PAUSE_COLOR;
        } else if (prevPhase === "hold" || prevPhase === "rest") {
          path.style.transition = `stroke ${COLOR_FADE_MS}ms ease`;
          path.style.stroke = ink;
        }

        const nextText =
          phase === "inhale"
            ? "udahni"
            : phase === "exhale"
              ? "izdahni"
              : "";
        const el = phaseRef.current;
        if (el) {
          if (phaseFade) {
            if (phase === "hold" || phase === "rest") {
              // entering a pause — the outgoing text already faded out to
              // invisible during the tail end of the previous phase (see
              // the pre-fade check below), so just blank it, no transition
              el.style.transition = "none";
              el.textContent = "";
              el.style.opacity = "0";
            } else if (prevPhase === null) {
              // very first frame on mount — one slow, smooth fade in
              el.textContent = nextText;
              el.style.transition = "none";
              el.style.opacity = "0";
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  el.style.transition = "opacity 2800ms ease-in-out";
                  el.style.opacity = "1";
                });
              });
            } else {
              // leaving a pause (hold/rest) — start fading in right away,
              // finishing partway into the new inhale/exhale phase
              el.textContent = nextText;
              el.style.transition = `opacity ${TEXT_FADE_MS}ms ease`;
              el.style.opacity = "1";
            }
          } else {
            el.textContent = nextText;
          }
        }
      }

      // fade the text out early so it finishes exactly as the upcoming
      // pause (hold/rest) begins, instead of fading during the pause
      if (
        phaseFade &&
        ((phase === "inhale" && holdMs > 0) ||
          (phase === "exhale" && restMs > 0)) &&
        !preFadeStartedRef.current
      ) {
        const phaseEndT =
          phase === "inhale" ? inhaleMs : inhaleMs + holdMs + exhaleMs;
        const remaining = phaseEndT - tInCycle;
        if (remaining <= TEXT_FADE_MS) {
          preFadeStartedRef.current = true;
          const el = phaseRef.current;
          if (el) {
            el.style.transition = `opacity ${Math.max(remaining, 0)}ms ease`;
            el.style.opacity = "0";
          }
        }
      }

      // ease the stroke color to green early so it's already green exactly
      // as the upcoming pause (hold/rest) begins
      if (
        ((phase === "inhale" && holdMs > 0) ||
          (phase === "exhale" && restMs > 0)) &&
        !preColorFadeStartedRef.current
      ) {
        const phaseEndT =
          phase === "inhale" ? inhaleMs : inhaleMs + holdMs + exhaleMs;
        const remaining = phaseEndT - tInCycle;
        if (remaining <= COLOR_FADE_MS) {
          preColorFadeStartedRef.current = true;
          path.style.transition = `stroke ${Math.max(remaining, 0)}ms ease`;
          path.style.stroke = PAUSE_COLOR;
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
  }, [inhaleSeconds, exhaleSeconds, phaseFade, holdSeconds, restSeconds, ink]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background,
        overflow: "hidden",
        fontFamily: "'Jost', system-ui, sans-serif",
        zIndex: 45,
      }}
    >
      {showLabel && (
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 0,
            right: 0,
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 3,
            opacity: labelVisible ? 1 : 0,
            transform: labelVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
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
      )}

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
          style={{
            width: `min(${80 * sizeScale}vw, ${420 * sizeScale}px)`,
            height: `min(${80 * sizeScale}vw, ${420 * sizeScale}px)`,
            overflow: "visible",
          }}
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
              fontSize={phaseFontSize}
            >
              udahni
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
