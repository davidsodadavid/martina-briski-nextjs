"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

const FADE_MS = 400;

type PageTransitionContextValue = {
  /** Fades the current page out, then navigates once it's invisible. */
  navigate: (href: string) => void;
};

const PageTransitionContext =
  createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error(
      "usePageTransition must be used within a PageTransitionProvider",
    );
  }
  return ctx;
}

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const isTransitioningRef = useRef(false);
  const isFirstRenderRef = useRef(true);

  function navigate(href: string) {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setVisible(false);
    setTimeout(() => router.push(href), FADE_MS);
  }

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    // only fade the arriving page in if we were the ones who triggered the
    // navigation — regular link clicks / back-forward stay instant
    if (isTransitioningRef.current) {
      isTransitioningRef.current = false;
      setVisible(true);
    }
  }, [pathname]);

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      <div
        className="flex min-h-full flex-1 flex-col"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      >
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
