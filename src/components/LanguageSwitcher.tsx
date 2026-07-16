"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/shared";
import { useLocale } from "@/components/LocaleProvider";

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale();
  const router = useRouter();

  function setLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div
      className={`flex items-center gap-1 text-xs font-medium tracking-[0.18em] uppercase ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={() => setLocale("hr")}
        aria-current={locale === "hr"}
        className={locale === "hr" ? "opacity-100" : "opacity-50 hover:opacity-80"}
      >
        Hr
      </button>
      <span className="opacity-40">/</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-current={locale === "en"}
        className={locale === "en" ? "opacity-100" : "opacity-50 hover:opacity-80"}
      >
        En
      </button>
    </div>
  );
}
