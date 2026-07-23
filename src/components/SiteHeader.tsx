"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import PracticeCardsGrid from "@/components/PracticeCardsGrid";
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

type Dict = ReturnType<typeof useDict>;

function NavLinksList({
  links,
  expanded,
  setExpanded,
  closeMenu,
  dict,
  trailing,
}: {
  links: NavLink[];
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  closeMenu: () => void;
  dict: Dict;
  trailing?: React.ReactNode;
}) {
  return (
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
          <li key={link.label}>
            <div className="flex w-fit items-center gap-2.5">
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
                  className="group flex w-fit cursor-pointer items-baseline gap-[18px] py-1 text-left"
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
                    isExpanded ? dict.nav.closeSubmenu : dict.nav.openSubmenu
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
      {trailing}
    </ul>
  );
}

function NavPracticeLink({
  links,
  dict,
  closeMenu,
}: {
  links: NavLink[];
  dict: Dict;
  closeMenu: () => void;
}) {
  return (
    <Link
      href="/practice"
      onClick={closeMenu}
      className="group flex w-fit items-baseline gap-[18px] py-1"
    >
      <span
        className="w-[26px] text-xs tracking-[0.1em] text-[var(--nav-highlight)]"
        style={{ fontFamily: "var(--font-jost), sans-serif" }}
      >
        {String(links.length + 1).padStart(2, "0")}
      </span>
      <span
        className="text-[clamp(28px,4vw,39px)] leading-[1.26] text-[var(--nav-overlay-text)] transition-colors duration-[250ms] group-hover:text-[var(--nav-highlight)]"
        style={{ fontFamily: "var(--font-marcellus), serif" }}
      >
        {dict.nav.practice}
      </span>
    </Link>
  );
}

function NavPracticeSection({
  links,
  dict,
  closeMenu,
  practiceCards,
  cardsClassName,
}: {
  links: NavLink[];
  dict: Dict;
  closeMenu: () => void;
  practiceCards: { label: string; href: string }[];
  cardsClassName: string;
}) {
  return (
    <>
      <NavPracticeLink links={links} dict={dict} closeMenu={closeMenu} />
      <PracticeCardsGrid
        onNavigate={closeMenu}
        practiceCards={practiceCards}
        cardsClassName={cardsClassName}
      />
    </>
  );
}

function NavCta({
  closeMenu,
  dict,
  className,
}: {
  closeMenu: () => void;
  dict: Dict;
  className: string;
}) {
  return (
    <Link
      href="/contact"
      onClick={closeMenu}
      className={className}
      style={{ fontFamily: "var(--font-jost), sans-serif" }}
    >
      {dict.nav.cta}
    </Link>
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
    { label: dict.nav.blog, href: "/blog" },
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

        <div className="flex items-center gap-6">
          <div
            style={{
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
            }}
            className="transition-opacity duration-[250ms]"
          >
            <LanguageSwitcher className="text-[var(--nav-overlay-text)]" />
          </div>

          <button
            type="button"
            onClick={() => (open ? closeMenu() : setOpen(true))}
            aria-label={dict.nav.menu}
            className="relative z-[100] block h-8 w-14 cursor-pointer text-[var(--nav-overlay-text)]"
          >
            <WavyBars animate={!open} />
            <span
              className="absolute left-[10px] h-0.5 w-9 bg-[var(--nav-overlay-text)] transition-[top,transform,opacity] duration-[350ms] ease-[cubic-bezier(.6,.05,.2,1)]"
              style={{
                top: open ? "14px" : "0px",
                transform: open ? "rotate(45deg)" : "none",
                opacity: open ? 1 : 0,
              }}
            />
            <span
              className="absolute left-[10px] h-0.5 w-9 bg-[var(--nav-overlay-text)] transition-[top,transform,opacity] duration-[350ms] ease-[cubic-bezier(.6,.05,.2,1)]"
              style={{
                top: open ? "14px" : "28px",
                transform: open ? "rotate(-45deg)" : "none",
                opacity: open ? 1 : 0,
              }}
            />
          </button>
        </div>
      </header>

      <nav
        aria-hidden={!open}
        style={{
          // fading the nav's own background out (not just hiding it) lets
          // the page underneath fade into view as the menu closes, instead
          // of instantly popping in.
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        className="fixed inset-x-0 top-[72px] bottom-0 z-[90] flex flex-col bg-[var(--nav-bg)] text-[var(--nav-overlay-text)] transition-opacity duration-[450ms] ease-out"
      >
        {/* Mobile & tablet: its own independent layout. The "07 Practice"
            label stays up with the rest of the list (scrolls together if
            needed); the practice cards move down and stay pinned to the
            bottom of the screen together with the CTA. */}
        <div className="flex h-full flex-col md:hidden">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-11">
            <NavLinksList
              links={links}
              expanded={expanded}
              setExpanded={setExpanded}
              closeMenu={closeMenu}
              dict={dict}
              trailing={
                <li>
                  <NavPracticeLink links={links} dict={dict} closeMenu={closeMenu} />
                </li>
              }
            />
          </div>

          <div className="flex flex-col gap-5 px-6 pt-4 pb-8">
            <PracticeCardsGrid
              onNavigate={closeMenu}
              practiceCards={PRACTICE_CARDS}
              cardsClassName="grid grid-cols-3 gap-3"
              truncateLabels
              uniformHeight
            />
            <NavCta
              closeMenu={closeMenu}
              dict={dict}
              className="block w-full rounded-full bg-[var(--nav-highlight)] px-[26px] py-3.5 text-center text-xs font-medium tracking-[0.24em] text-[var(--nav-dark-text)] uppercase transition-colors duration-[250ms] hover:bg-[var(--nav-highlight-dark)]"
            />
          </div>
        </div>

        {/* Desktop: original two-column layout, unchanged. */}
        <div className="hidden flex-1 items-center justify-center gap-16 px-[clamp(24px,6vw,66px)] md:flex">
          <div className="flex flex-col gap-8">
            <NavLinksList
              links={links}
              expanded={expanded}
              setExpanded={setExpanded}
              closeMenu={closeMenu}
              dict={dict}
            />

            <NavCta
              closeMenu={closeMenu}
              dict={dict}
              className="inline-block w-fit self-start rounded-full bg-[var(--nav-highlight)] px-[26px] py-3.5 text-xs font-medium tracking-[0.24em] text-[var(--nav-dark-text)] uppercase transition-colors duration-[250ms] hover:bg-[var(--nav-highlight-dark)]"
            />
          </div>

          <div className="flex w-[340px] shrink-0 flex-col gap-5">
            <NavPracticeSection
              links={links}
              dict={dict}
              closeMenu={closeMenu}
              practiceCards={PRACTICE_CARDS}
              cardsClassName="flex flex-col gap-3"
            />
          </div>
        </div>
      </nav>
    </>
  );
}
