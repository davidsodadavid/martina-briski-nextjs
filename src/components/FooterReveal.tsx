"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades/slides the footer's content in once it scrolls into view.
 */
export default function FooterReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="relative flex min-h-screen flex-col">
      <div
        className="relative flex flex-1 flex-col transition-[opacity,transform] duration-[900ms] ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(40px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
