"use client";

import { useEffect, useRef, useState } from "react";

const INTRO_LINES = ["TVOJ DAH", "TVOJ RITAM", "TVOJ PROSTOR"];

const INTRO_LINE_FADE_MS = 1200;
const INTRO_LINE_STAGGER_MS = 850;

/** Replaces an SVG <text> element's content with several vertically centered
 * <tspan> lines — plain textContent can't wrap/stack inside SVG text — and
 * fades each line in one after another. Returns the setTimeout ids used for
 * the staggered reveal so the caller can clear them on cleanup/unmount. */
function showIntroLines(
  el: SVGTextElement,
  lines: string[],
  lineHeight: number
): ReturnType<typeof setTimeout>[] {
  el.style.transition = "none";
  el.style.opacity = "1";
  el.textContent = "";
  const startDy = -((lines.length - 1) / 2) * lineHeight;
  const timeouts: ReturnType<typeof setTimeout>[] = [];
  lines.forEach((line, i) => {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", "0");
    tspan.setAttribute("dy", String(i === 0 ? startDy : lineHeight));
    tspan.textContent = line;
    tspan.style.opacity = "0";
    el.appendChild(tspan);
    timeouts.push(
      setTimeout(() => {
        tspan.style.transition = `opacity ${INTRO_LINE_FADE_MS}ms ease-in-out`;
        tspan.style.opacity = "1";
      }, i * INTRO_LINE_STAGGER_MS)
    );
  });
  return timeouts;
}

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
  /** Font size (px) of the centered "udah"/"izdah" text. Default 20. */
  phaseFontSize?: number;
  /** Cross-fade the "udah"/"izdah" text instead of swapping it instantly. Default false. */
  phaseFade?: boolean;
  /** Seconds to hold the circle at full expansion after inhaling, before it
   * starts to shrink. No text is shown during the hold. Default 0 (no hold). */
  holdSeconds?: number;
  /** Seconds to rest at full contraction after exhaling, before it starts
   * to grow again. No text is shown during the rest. Default 0 (no rest). */
  restSeconds?: number;
  /** Vertical position of the circle on narrow (mobile) screens — "center"
   * keeps it centered like on desktop, "top" moves it higher up. Only
   * affects screens ≤640px; desktop/tablet are unaffected. Default "center". */
  mobileAlign?: "center" | "top";
  /** Show the staggered "TVOJ DAH / TVOJ RITAM / TVOJ PROSTOR" intro on
   * mount instead of jumping straight to the regular udah/izdah phase text.
   * Default true. */
  showIntro?: boolean;
}

export default function BreathingCircle({
  inhaleSeconds = 6,
  exhaleSeconds = 6,
  background = "#5F6D6A",
  ink = "#F1F1F1",
  label = "disanje",
  showLabel = true,
  labelRevealDelayMs = 0,
  sizeScale = 1,
  phaseFontSize = 20,
  phaseFade = false,
  holdSeconds = 0,
  restSeconds = 0,
  mobileAlign = "center",
  showIntro = true,
}: BreathingCircleProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const phaseRef = useRef<SVGTextElement>(null);
  const startRef = useRef(0);
  const lastPhaseRef = useRef<"inhale" | "hold" | "exhale" | "rest" | null>(
    null,
  );
  const preFadeStartedRef = useRef(false);
  const preColorFadeStartedRef = useRef(false);
  const introTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
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
    const PAUSE_COLOR = "#D3F9B5";
    const inhaleMs = inhaleSeconds * 1000;
    const holdMs = holdSeconds * 1000;
    const exhaleMs = exhaleSeconds * 1000;
    const restMs = restSeconds * 1000;
    const cycleMs = inhaleMs + holdMs + exhaleMs + restMs;

    // The circle's on-screen size is entirely driven by the SVG container's
    // CSS width/height (see .breathing-circle-svg in globals.css) — the
    // radius here just needs to fill the fixed 400x400 viewBox well, so it
    // stays constant rather than re-deriving a second, redundant responsive
    // scale from window width.
    const baseRadius = 140;

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
            ? "udah"
            : phase === "exhale"
              ? "izdah"
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
            } else if (prevPhase === null && showIntro) {
              // very first frame on mount — the opening cue ("your breath,
              // your rhythm, your space") instead of the regular one-word
              // phase label, each line fading in one after another
              introTimeoutsRef.current = showIntroLines(
                el,
                INTRO_LINES,
                phaseFontSize * 1.3
              );
            } else if (prevPhase === null) {
              // very first frame on mount, intro skipped — still ease the
              // regular udah/izdah text in rather than having it just pop
              // in at full opacity immediately
              el.textContent = nextText;
              el.style.transition = "none";
              el.style.opacity = "0";
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  el.style.transition = `opacity ${TEXT_FADE_MS}ms ease`;
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

      // A bit narrower when fully shrunk (breath 0) than at full inhale
      // (breath 1), where the width stays at the original 0.8.
      const xScale = 0.78 + breath * 0.02;
      const yScale = 1.1;

      const points: [number, number][] = [];
      for (let i = 0; i <= NUM_POINTS; i++) {
        const angle = (Math.PI * 2 * i) / NUM_POINTS;
        const wave = Math.sin(angle * 4 + elapsed);
        const r = baseRadius + wave * 8 + breath * 40;
        points.push([r * Math.cos(angle) * xScale, r * Math.sin(angle) * yScale]);
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
      introTimeoutsRef.current.forEach(clearTimeout);
    };
  }, [
    inhaleSeconds,
    exhaleSeconds,
    phaseFade,
    holdSeconds,
    restSeconds,
    ink,
    phaseFontSize,
    showIntro,
  ]);

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
          <a
            href="/practice"
            style={{
              pointerEvents: "auto",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: ink,
              textDecoration: "underline",
            }}
          >
            vježbe
          </a>
          <span
            style={{
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: ink,
            }}
          >
            {" "}
            &middot; {label}
          </span>
          <span
            style={{
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "#D3F9B5",
            }}
          >
            {" "}
            &middot; {inhaleSeconds}s udah / {exhaleSeconds}s izdah
          </span>
        </div>
      )}

      <div
        className={
          mobileAlign === "top"
            ? "breathing-circle-wrap breathing-circle-wrap--top"
            : "breathing-circle-wrap"
        }
      >
        <svg
          viewBox="0 0 400 400"
          className="breathing-circle-svg"
          style={
            {
              overflow: "visible",
              "--circle-vw": 80 * sizeScale,
              "--circle-px": 420 * sizeScale,
            } as React.CSSProperties
          }
        >
          <g transform="translate(200, 200)">
            <g className="breathing-circle-spin">
              <path
                ref={pathRef}
                fill="none"
                stroke={ink}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <text
              ref={phaseRef}
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ink}
              fontFamily="'Marcellus', serif"
              fontSize={phaseFontSize}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
