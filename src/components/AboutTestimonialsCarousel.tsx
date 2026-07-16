"use client";

import { useState } from "react";

type Testimonial = {
  id: string;
  authorName: string;
  title: string | null;
  description: string;
};

export default function AboutTestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [i, setI] = useState(0);
  const total = testimonials.length;
  const current = testimonials[i];

  function go(n: number) {
    setI(((n % total) + total) % total);
  }

  return (
    <section className="bg-[var(--nav-bg)] px-6 py-[clamp(48px,6vw,80px)] text-[var(--nav-overlay-text)] md:px-10">
      <div className="mx-auto max-w-[1267px]">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
        <h2
          className="text-[clamp(26px,3.4vw,44px)] tracking-[0.02em]"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          Iskustva polaznika
        </h2>
        <span
          className="text-xs tracking-[0.24em] text-[var(--nav-highlight)] uppercase"
          style={{ fontFamily: "var(--font-jost), sans-serif" }}
        >
          — ono što ljudi kažu
        </span>
      </div>

      <div className="flex min-h-[180px] flex-col gap-7">
        <span
          className="text-5xl leading-[0.5] text-[var(--nav-highlight)]"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          &ldquo;
        </span>
        <blockquote
          className="max-w-[24ch] text-[clamp(24px,3.2vw,40px)] leading-[1.35]"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          {current.description}
        </blockquote>
        <figcaption
          className="text-xs tracking-[0.16em] text-[var(--nav-highlight)] uppercase"
          style={{ fontFamily: "var(--font-jost), sans-serif" }}
        >
          {current.authorName}
          {current.title && (
            <>
              {" "}
              &middot; <span className="normal-case opacity-70">{current.title}</span>
            </>
          )}
        </figcaption>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border-t border-[var(--nav-highlight)]/20 pt-6">
        <div className="flex items-center gap-2.5">
          {testimonials.map((t, d) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(d)}
              aria-label={`Iskustvo ${d + 1}`}
              className="h-2 w-2 rounded-full transition-all duration-300"
              style={{
                background:
                  d === i
                    ? "var(--nav-highlight)"
                    : "rgba(237,235,227,0.3)",
                transform: d === i ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-5">
          <span
            className="text-xs tracking-[0.14em] opacity-75"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            {String(i + 1).padStart(2, "0")} &nbsp;/&nbsp;{" "}
            {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Prethodno"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[var(--nav-overlay-text)]/40 text-lg hover:border-[var(--nav-highlight)] hover:text-[var(--nav-highlight)]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label="Sljedeće"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[var(--nav-overlay-text)]/40 text-lg hover:border-[var(--nav-highlight)] hover:text-[var(--nav-highlight)]"
            >
              →
            </button>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
