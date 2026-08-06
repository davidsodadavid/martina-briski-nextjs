"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDict } from "@/components/LocaleProvider";
import { usePageTransition } from "@/components/PageTransitionProvider";

/** Appears after the visitor has spent 5s on the homepage, offering a way
 * into the practice tools instead of just watching the breathing circle. */
export default function HomePracticeCta() {
  const dict = useDict();
  const { navigate } = usePageTransition();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute inset-x-0 bottom-10 z-[46] flex justify-end px-6 transition-[opacity,transform] duration-700 ease-out md:px-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Link
        href="/practice"
        onClick={(e) => {
          e.preventDefault();
          navigate("/practice");
        }}
        className="block w-full rounded-lg bg-[var(--nav-highlight)] px-[26px] py-3.5 text-center text-xs font-medium tracking-[0.24em] text-[var(--nav-dark-text)] uppercase transition-colors duration-[250ms] hover:bg-[var(--nav-highlight-dark)] md:w-auto"
        style={{ fontFamily: "var(--font-jost), sans-serif" }}
      >
        {dict.homepage.goToPractice}
      </Link>
    </div>
  );
}
