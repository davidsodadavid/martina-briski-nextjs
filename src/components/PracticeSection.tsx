"use client";

import { useState } from "react";
import Link from "next/link";

type PracticeItem = {
  title: string;
  subtitle: string;
  description: string;
};

const TOOLS = [
  {
    label: "Ritam disanja za smireni um",
    href: "/practice/breathing-circle",
  },
  {
    label: "Plank",
    href: "/practice/breath-timer",
  },
];

const DEFAULT_TITLE =
  "Pronađi svoj ritam i osjeti kako dah oblikuje tvoju snagu i prisutnost.";
const DEFAULT_TEXT =
  "Dvije vježbe disanja stoje pred tobom. Prva vježba te vodi kroz ritam udaha i izdaha uz animaciju koja ti pomaže da se sinkroniziraš. Druga vježba plank s brojanjem udaha gradi tvoju snagu i fokus. Odaberi svoju vježbu i započni.";

export default function PracticeSection({
  items,
}: {
  items: PracticeItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-10 text-center md:px-10 md:py-12">
        <div className={active ? "mx-auto max-w-[1100px]" : "mx-auto max-w-[880px]"}>
          <span
            className="mb-3 inline-block text-3xl leading-none text-[var(--nav-highlight)]"
            aria-hidden
          >
            +
          </span>

          {active ? (
            <>
              <h1
                className="text-[clamp(22px,2.8vw,34px)] leading-[1.3] font-bold italic"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {active.title}
              </h1>
              {active.subtitle && (
                <p className="mt-2 text-xs tracking-[0.14em] text-[var(--nav-highlight)] uppercase">
                  {active.subtitle}
                </p>
              )}
              {active.description && (
                <div
                  className="mx-auto mt-4 max-w-[1100px] text-left text-[14px] leading-[1.7] text-[var(--nav-overlay-text)]/85 md:columns-2 md:gap-10 md:[column-fill:balance] [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:font-semibold [&_h3]:break-inside-avoid [&_h3]:text-[var(--nav-highlight)] [&_p]:mb-3 [&_p]:break-inside-avoid [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: active.description }}
                />
              )}
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="mt-5 text-xs font-medium tracking-[0.14em] text-[var(--nav-overlay-text)]/70 uppercase hover:text-[var(--nav-highlight)]"
              >
                ← Natrag na uvod
              </button>
            </>
          ) : (
            <>
              <h1
                className="text-[clamp(22px,2.8vw,34px)] leading-[1.3] font-bold italic"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {DEFAULT_TITLE}
              </h1>
              <p className="mx-auto mt-4 max-w-[70ch] text-[14px] leading-[1.7] text-[var(--nav-overlay-text)]/85">
                {DEFAULT_TEXT}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Tool cards — horizontal on desktop */}
      <section className="flex flex-1 items-center px-6 py-8 md:px-10">
        <div className="mx-auto grid w-full max-w-[1267px] grid-cols-1 gap-5 sm:grid-cols-2">
          {TOOLS.map((tool, i) => (
            <div
              key={tool.href}
              className="group relative flex h-[260px] flex-col overflow-hidden rounded-2xl border border-[var(--nav-overlay-text)]/25 bg-[var(--nav-bg)] transition-colors hover:border-[var(--nav-highlight)]"
            >
              <Link
                href={tool.href}
                aria-label={tool.label}
                className="absolute inset-0 z-0"
              />
              {items[i] && (items[i].title || items[i].description) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveIndex(i);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-label={`Info o vježbi: ${tool.label}`}
                  className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--nav-overlay-text)]/40 text-xs text-[var(--nav-overlay-text)] hover:border-[var(--nav-highlight)] hover:text-[var(--nav-highlight)]"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  i
                </button>
              )}

              <div className="pointer-events-none relative z-10 mt-auto flex flex-col gap-2 p-6">
                <span
                  className="text-xs tracking-[0.2em] text-[var(--nav-highlight)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-xl text-[var(--nav-overlay-text)]"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  {tool.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
