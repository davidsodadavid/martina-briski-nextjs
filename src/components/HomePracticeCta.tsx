"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDict } from "@/components/LocaleProvider";

/** Appears after the visitor has spent 10s on the homepage, offering a way
 * into the practice tools instead of just watching the breathing circle. */
export default function HomePracticeCta() {
  const dict = useDict();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute inset-x-0 bottom-10 z-[46] flex flex-wrap items-center justify-center gap-3 px-6 transition-[opacity,transform] duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Link
        href="/practice/breathing-circle"
        className="inline-block rounded-full bg-[var(--nav-highlight)] px-[26px] py-3.5 text-xs font-medium tracking-[0.24em] text-[var(--nav-dark-text)] uppercase transition-colors duration-[250ms] hover:bg-[var(--nav-highlight-dark)]"
        style={{ fontFamily: "var(--font-jost), sans-serif" }}
      >
        {dict.homepage.goToPractice}
      </Link>
      <Link
        href="/practice/breath-timer"
        className="inline-block rounded-full border border-[var(--nav-overlay-text)]/55 px-[26px] py-3.5 text-xs font-medium tracking-[0.24em] text-[var(--nav-overlay-text)] uppercase transition-colors duration-[250ms] hover:bg-[var(--nav-overlay-text)]/10"
        style={{ fontFamily: "var(--font-jost), sans-serif" }}
      >
        {dict.homepage.nextPractice}
      </Link>
    </div>
  );
}
