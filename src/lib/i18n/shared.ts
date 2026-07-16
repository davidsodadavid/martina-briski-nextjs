import hr, { type Dictionary } from "./dictionaries/hr";
import en from "./dictionaries/en";

export type Locale = "hr" | "en";

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "hr";

const dictionaries: Record<Locale, Dictionary> = { hr, en };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "hr" || value === "en";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
