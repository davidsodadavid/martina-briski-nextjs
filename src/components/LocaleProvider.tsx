"use client";

import { createContext, useContext } from "react";
import type { Locale, Dictionary } from "@/lib/i18n/shared";

const LocaleContext = createContext<{
  locale: Locale;
  dict: Dictionary;
} | null>(null);

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx.locale;
}

export function useDict() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useDict must be used within a LocaleProvider");
  }
  return ctx.dict;
}
