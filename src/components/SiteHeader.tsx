"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import BreathTimerPreview from "@/components/BreathTimerPreview";
import BreathingCirclePreview from "@/components/BreathingCirclePreview";
import AudioPracticePreview from "@/components/AudioPracticePreview";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useDict } from "@/components/LocaleProvider";

type NavLink = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

function WavyBars({ animate }: { animate: boolean }) {
  return (
    <svg
      viewBox="0 0 36 32"
      className="absolute inset-0 block h-full w-full"
      style={{
        opacity: animate ? 1 : 0,
        transition: "opacity .25s ease",
      }}
    >
      <path
        d="M4,8 Q11,8 18,8 T32,8"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        style={{ animation: animate ? "waveLine1 2.2s ease-in-out infinite" : "none" }}
      />
      <path
        d="M4,16 Q11,16 18,16 T32,16"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        style={{
          animation: animate ? "waveLine2 2.2s ease-in-out infinite .15s" : "none",
        }}
      />
      <path
        d="M4,24 Q11,24 18,24 T32,24"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        style={{ animation: animate ? "waveLine3 2.2s ease-in-out infinite .3s" : "none" }}
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

type Program = { name: string; slug: string };

export default function SiteHeader({
  programs = [],
}: {
  programs?: Program[];
}) {
  const dict = useDict();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const PRACTICE_CARDS = [
    {
      label: dict.nav.practiceItems.breathingCircle,
      href: "/practice/breathing-circle",
    },
    { label: dict.nav.practiceItems.breathTimer, href: "/practice/breath-timer" },
    { label: dict.nav.practiceItems.audioPractice, href: "/practice/audio-practice" },
  ];

  const links: NavLink[] = [
    { label: dict.nav.blog, href: "/" },
    { label: dict.nav.about, href: "/about" },
    {
      label: dict.nav.programs,
      children: programs.map((program) => ({
        label: program.name,
        href: `/programs/${program.slug}`,
      })),
    },
    { label: dict.nav.events, href: "/events" },
    { label: dict.nav.shop, href: "/shop" },
    { label: dict.nav.freeContent, href: "/free-content" },
  ];

  function closeMenu() {
    setOpen(false);
    setExpanded({});
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-[var(--nav-bg)] px-6 py-5 md:px-10">
        <Link href="/" onClick={closeMenu}>
          <Logo className="h-4 w-auto md:h-5" />
        </Link>

        <button
          type="button"
          onClick={() => (open ? closeMenu() : setOpen(true))}
          aria-label={dict.nav.menu}
          className="relative z-[100] block h-8 w-14 cursor-pointer text-[var(--nav-overlay-text)]"
        >
          <WavyBars animate={!open} />
          <span
            className="absolute left-0 h-0.5 w-14 bg-[var(--nav-overlay-text)] transition-[top,transform,opacity] duration-[350ms] ease-[cubic-bezier(.6,.05,.2,1)]"
            style={{
              top: open ? "14px" : "0px",
              transform: open ? "rotate(45deg)" : "none",
              opacity: open ? 1 : 0,
            }}
          />
          <span
            className="absolute left-0 h-0.5 w-14 bg-[var(--nav-overlay-text)] transition-[top,transform,opacity] duration-[350ms] ease-[cubic-bezier(.6,.05,.2,1)]"
            style={{
              top: open ? "14px" : "28px",
              transform: open ? "rotate(-45deg)" : "none",
              opacity: open ? 1 : 0,
            }}
          />
        </button>
      </header>

      <nav
        aria-hidden={!open}
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: open ? "auto" : "none",
        }}
        className="fixed inset-0 z-[90] flex flex-col bg-[var(--nav-bg)] px-6 py-11 text-[var(--nav-overlay-text)] transition-[opacity,transform] duration-[450ms] ease-out md:px-[clamp(24px,6vw,66px)]"
      >
        <div className="flex items-center justify-between">
          <Logo className="h-4 w-auto md:h-5" />
          <div className="flex items-center gap-6">
            <LanguageSwitcher className="text-[var(--nav-overlay-text)]" />
            <button
              type="button"
              onClick={closeMenu}
              aria-label={`${dict.nav.close} ${dict.nav.menu}`}
              className="flex cursor-pointer items-center gap-2.5"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              <span className="text-xs font-medium tracking-[0.26em] uppercase">
                {dict.nav.close}
              </span>
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-10 md:flex-row md:items-center md:gap-16">
        <div className="flex flex-col gap-8">
        <ul className="flex flex-col gap-1">
          {links.map((link, i) => {
            const number = String(i + 1).padStart(2, "0");
            const hasChildren = !!link.children?.length;
            const isExpanded = !!expanded[link.label];

            const numberEl = (
              <span
                className="w-[26px] text-xs tracking-[0.1em] text-[var(--nav-highlight)]"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {number}
              </span>
            );
            const labelEl = (
              <span
                className="text-[clamp(28px,4vw,39px)] leading-[1.26] text-[var(--nav-overlay-text)] transition-colors duration-[250ms] group-hover:text-[var(--nav-highlight)]"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {link.label}
              </span>
            );
            const toggle = () =>
              setExpanded((prev) => ({
                ...prev,
                [link.label]: !prev[link.label],
              }));

            return (
              <li
                key={link.label}
                style={
                  open
                    ? {
                        animation:
                          "menuRise .6s cubic-bezier(.22,.61,.36,1) both",
                        animationDelay: `${0.08 + i * 0.07}s`,
                      }
                    : undefined
                }
              >
                <div className="flex w-fit items-baseline gap-2.5">
                  {link.href ? (
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex w-fit items-baseline gap-[18px] py-1"
                    >
                      {numberEl}
                      {labelEl}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={toggle}
                      className="group flex w-fit cursor-pointer items-baseline gap-[18px] py-1"
                    >
                      {numberEl}
                      {labelEl}
                    </button>
                  )}
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={toggle}
                      aria-label={
                        isExpanded
                          ? dict.nav.closeSubmenu
                          : dict.nav.openSubmenu
                      }
                      aria-expanded={isExpanded}
                      className="cursor-pointer p-1.5 text-[var(--nav-highlight)]"
                    >
                      <ChevronIcon
                        className={`h-3.5 w-3.5 transition-transform duration-[250ms] ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                  >
                    <ul className="flex min-h-0 flex-col gap-1 overflow-hidden">
                      {link.children!.map((child, ci) => (
                        <li key={child.href} className="pl-[24px]">
                          <Link
                            href={child.href}
                            onClick={closeMenu}
                            className="group flex w-fit items-baseline gap-[18px] py-1"
                          >
                            <span
                              className="w-[26px] text-xs tracking-[0.1em] text-[var(--nav-highlight)]"
                              style={{
                                fontFamily: "var(--font-jost), sans-serif",
                              }}
                            >
                              {number}.{ci + 1}
                            </span>
                            <span
                              className="text-[clamp(18px,2.6vw,22px)] leading-[1.3] text-[var(--nav-overlay-text)] opacity-80 transition-colors duration-[250ms] group-hover:text-[var(--nav-highlight)] group-hover:opacity-100"
                              style={{
                                fontFamily: "var(--font-marcellus), serif",
                              }}
                            >
                              {child.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div
          style={
            open
              ? {
                  animation: "menuRise .6s cubic-bezier(.22,.61,.36,1) both",
                  animationDelay: `${0.08 + links.length * 0.07}s`,
                }
              : undefined
          }
        >
          <Link
            href="/contact"
            onClick={closeMenu}
            className="inline-block rounded-full bg-[var(--nav-highlight)] px-[26px] py-3.5 text-xs font-medium tracking-[0.24em] text-[var(--nav-dark-text)] uppercase transition-colors duration-[250ms] hover:bg-[var(--nav-highlight-dark)]"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            {dict.nav.cta}
          </Link>
        </div>
        </div>

        {/* Desktop-only: Vježbe stays visible on the right, separate from
            the numbered list, instead of being a collapsible entry in it. */}
        <div
          className="hidden md:flex md:w-[300px] md:shrink-0 md:flex-col md:gap-5"
          style={
            open
              ? {
                  animation: "menuRise .6s cubic-bezier(.22,.61,.36,1) both",
                  animationDelay: `${0.08 + links.length * 0.07}s`,
                }
              : undefined
          }
        >
          <Link
            href="/practice"
            onClick={closeMenu}
            className="text-[clamp(22px,2.4vw,28px)] leading-[1.2] text-[var(--nav-overlay-text)] transition-colors duration-[250ms] hover:text-[var(--nav-highlight)]"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            {dict.nav.practice}
          </Link>

          <div className="flex flex-col gap-3">
            {PRACTICE_CARDS.map((item, i) => {
              const isBreathTimer = item.href === "/practice/breath-timer";
              const isBreathingCircle =
                item.href === "/practice/breathing-circle";
              const isAudioPractice =
                item.href === "/practice/audio-practice";

              return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-[var(--nav-overlay-text)]/25 transition-colors hover:border-[var(--nav-highlight)] ${
                  isBreathingCircle || isAudioPractice ? "h-[153px]" : ""
                }`}
              >
                {isBreathTimer && (
                  <BreathTimerPreview className="h-16 w-full" />
                )}
                {isBreathingCircle && (
                  <BreathingCirclePreview className="absolute inset-0 h-full w-full" />
                )}
                {isAudioPractice && (
                  <AudioPracticePreview className="absolute inset-0 h-full w-full" />
                )}
                <div
                  className={`relative z-10 flex flex-col gap-2 p-5 ${
                    isBreathTimer
                      ? "pt-3"
                      : isBreathingCircle || isAudioPractice
                        ? "pt-[85px]"
                        : ""
                  }`}
                >
                  <span
                    className="text-xs tracking-[0.2em] text-[var(--nav-highlight)] uppercase"
                    style={{ fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-lg leading-[1.3] text-[var(--nav-overlay-text)]"
                    style={{ fontFamily: "var(--font-marcellus), serif" }}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
        </div>
      </nav>
    </>
  );
}
