"use client";

import { useState } from "react";
import type { ProgramStep } from "@/lib/program";

/**
 * "Kako izgleda program" — path stepper. Click a numbered dot; the
 * connecting line draws itself out to that point and the active step's
 * title/description fade in below. Horizontal row on desktop, vertical
 * stack on mobile — both share the same active-step state.
 */
export default function ProgramPathSteps({ steps }: { steps: ProgramStep[] }) {
  const [active, setActive] = useState(0);
  const fillPct = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;
  const dash = 960;
  const dashoffset = dash - (fillPct / 100) * dash;
  const activeStep = steps[active];
  const activeDesc = activeStep?.description || activeStep?.subtitle;

  const dotStyle = (i: number) => ({
    fontFamily: "var(--font-marcellus), serif",
    borderRadius: "50%",
    background: i <= active ? "var(--nav-highlight)" : "#E7E3D4",
    color: "var(--nav-dark-text)",
    opacity: i <= active ? 1 : 0.5,
    transform: i === active ? "scale(1.15)" : "scale(1)",
  });

  return (
    <div className="border border-[#D5D2C4] bg-[var(--nav-overlay-text)] px-6 pt-12 pb-10 md:px-12 md:pt-14 md:pb-12">
      <h2
        className="mb-10 text-[clamp(24px,3vw,30px)] font-normal"
        style={{ fontFamily: "var(--font-marcellus), serif" }}
      >
        Kako izgleda program
      </h2>

      {/* Desktop: horizontal row */}
      <div className="relative hidden md:block">
        <svg
          width="100%"
          height="28"
          viewBox="0 0 1000 28"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 3, left: 0, overflow: "visible" }}
        >
          <path
            d="M20,14 L980,14"
            stroke="#D5D2C4"
            strokeWidth={1.4}
            fill="none"
            style={{ animation: "programLineFloat 4s ease-in-out infinite" }}
          />
          <path
            d="M20,14 L980,14"
            stroke="var(--nav-highlight)"
            strokeWidth={1.4}
            fill="none"
            style={{
              strokeDasharray: dash,
              strokeDashoffset: dashoffset,
              transition: "stroke-dashoffset .5s ease",
              animation: "programLineFloat 4s ease-in-out infinite",
            }}
          />
        </svg>

        <div className="relative flex justify-between">
          {steps.map((step, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActive(i)}
              className="flex cursor-pointer flex-col items-center"
            >
              <div
                className="flex h-8 w-8 items-center justify-center text-[13px] transition-[background-color,color,transform] duration-300"
                style={dotStyle(i)}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="relative flex flex-col gap-7 md:hidden">
        <div
          className="absolute top-4 bottom-4 left-4 w-[1.4px] -translate-x-1/2 bg-[#D5D2C4]"
          style={{ animation: "programLineFloatVertical 4s ease-in-out infinite" }}
        />
        <div
          className="absolute top-4 left-4 w-[1.4px] -translate-x-1/2 bg-[var(--nav-highlight)] transition-[height] duration-500 ease-out"
          style={{
            height: `calc((100% - 32px) * ${fillPct / 100})`,
            animation: "programLineFloatVertical 4s ease-in-out infinite",
          }}
        />
        {steps.map((step, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setActive(i)}
            className="relative flex cursor-pointer items-center gap-4"
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center text-[13px] transition-[background-color,color,transform] duration-300"
              style={dotStyle(i)}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <span
              className="text-left text-[15px]"
              style={{
                fontFamily: "var(--font-marcellus), serif",
                opacity: i === active ? 1 : 0.6,
              }}
            >
              {step.title}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 min-h-[90px]">
        {activeStep && (
          <>
            <div
              key={`t${active}`}
              className="mb-2.5 animate-[programStepFade_.35s_ease_both] text-[22px]"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {activeStep.title}
            </div>
            {activeDesc && (
              <div
                key={`d${active}`}
                className="max-w-[640px] animate-[programStepFade_.35s_ease_.05s_both] text-[14.5px] leading-[1.7] text-[#55605B]"
              >
                {activeDesc}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
