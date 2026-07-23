"use client";

import { useEffect, useRef, useState } from "react";

/** Replaces the pointer with a "+" mark that follows the cursor while
 * hovering the breathing circle, matching the "+" used above the practice
 * section. Only kicks in for actual mouse pointers (`hover: hover` and
 * `pointer: fine`) — touch devices keep their normal behavior. Everywhere
 * else on the page the cursor stays the regular system pointer. */
export default function HomeCursor({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  // starts false so the server-rendered markup matches the client's first
  // render (avoiding a hydration mismatch); the real value is only knowable
  // once mounted in the browser
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setIsFinePointer(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${isFinePointer ? "cursor-none" : ""}`}
      onMouseMove={(e) => {
        if (!isFinePointer) return;
        const rect = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {isFinePointer && pos && (
        <span
          aria-hidden
          className="pointer-events-none absolute z-[60] -translate-x-1/2 -translate-y-1/2 text-3xl leading-none text-[var(--nav-highlight)]"
          style={{ left: pos.x, top: pos.y }}
        >
          +
        </span>
      )}
    </div>
  );
}
