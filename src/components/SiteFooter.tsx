import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FooterReveal from "@/components/FooterReveal";
import PracticeCardsGrid from "@/components/PracticeCardsGrid";
import InstagramIcon from "@/components/InstagramIcon";
import ContactLink from "@/components/ContactLink";
import type { Dictionary } from "@/lib/i18n/shared";

const INSTAGRAM_URL = "https://www.instagram.com/martinabriski/";

function FooterNavLink({
  number,
  label,
  href,
}: {
  number: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-baseline gap-[14px] py-1"
    >
      <span
        className="w-[22px] text-xs tracking-[0.1em] text-[var(--nav-highlight)]"
        style={{ fontFamily: "var(--font-jost), sans-serif" }}
      >
        {number}
      </span>
      <span
        className="text-[clamp(18px,2vw,26px)] leading-[1.25] text-[var(--nav-overlay-text)] transition-colors duration-[250ms] group-hover:text-[var(--nav-highlight)]"
        style={{ fontFamily: "var(--font-marcellus), serif" }}
      >
        {label}
      </span>
    </Link>
  );
}

const WAVE_PATH_1 =
  "M0.0,50.0 L6.7,52.6 L13.3,55.2 L20.0,57.6 L26.7,59.9 L33.3,61.8 L40.0,63.6 L46.7,64.9 L53.3,66.0 L60.0,66.7 L66.7,67.0 L73.3,67.0 L80.0,66.6 L86.7,66.0 L93.3,65.1 L100.0,64.0 L106.7,62.8 L113.3,61.4 L120.0,60.0 L126.7,58.6 L133.3,57.3 L140.0,56.0 L146.7,54.8 L153.3,53.8 L160.0,52.9 L166.7,52.2 L173.3,51.5 L180.0,51.0 L186.7,50.6 L193.3,50.3 L200.0,50.0 L206.7,49.7 L213.3,49.4 L220.0,49.0 L226.7,48.5 L233.3,47.8 L240.0,47.1 L246.7,46.2 L253.3,45.2 L260.0,44.0 L266.7,42.7 L273.3,41.4 L280.0,40.0 L286.7,38.6 L293.3,37.2 L300.0,36.0 L306.7,34.9 L313.3,34.0 L320.0,33.4 L326.7,33.0 L333.3,33.0 L340.0,33.3 L346.7,34.0 L353.3,35.1 L360.0,36.4 L366.7,38.2 L373.3,40.1 L380.0,42.4 L386.7,44.8 L393.3,47.4 L400.0,50.0";

const WAVE_PATH_2 =
  "M0.0,75.6 L6.7,75.9 L13.3,75.7 L20.0,75.1 L26.7,74.2 L33.3,73.1 L40.0,71.9 L46.7,70.7 L53.3,69.6 L60.0,68.6 L66.7,67.9 L73.3,67.5 L80.0,67.4 L86.7,67.5 L93.3,67.7 L100.0,68.0 L106.7,68.2 L113.3,68.4 L120.0,68.2 L126.7,67.9 L133.3,67.1 L140.0,66.0 L146.7,64.6 L153.3,63.0 L160.0,61.1 L166.7,59.2 L173.3,57.3 L180.0,55.6 L186.7,54.2 L193.3,53.1 L200.0,52.4 L206.7,52.1 L213.3,52.3 L220.0,52.9 L226.7,53.8 L233.3,54.9 L240.0,56.1 L246.7,57.3 L253.3,58.4 L260.0,59.4 L266.7,60.1 L273.3,60.5 L280.0,60.6 L286.7,60.5 L293.3,60.3 L300.0,60.0 L306.7,59.8 L313.3,59.6 L320.0,59.8 L326.7,60.1 L333.3,60.9 L340.0,62.0 L346.7,63.4 L353.3,65.0 L360.0,66.9 L366.7,68.8 L373.3,70.7 L380.0,72.4 L386.7,73.8 L393.3,74.9 L400.0,75.6";

const WAVE_TILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="90" viewBox="0 0 400 90"><path d="${WAVE_PATH_1}" stroke="white" stroke-opacity="0.3" stroke-width="1.5" fill="none"/><path d="${WAVE_PATH_2}" stroke="white" stroke-opacity="0.18" stroke-width="1.2" fill="none"/></svg>`;

const WAVE_TILE_DATA_URL = `data:image/svg+xml;base64,${Buffer.from(WAVE_TILE_SVG).toString("base64")}`;

export default async function SiteFooter({ dict }: { dict: Dictionary }) {
  const programs = await prisma.program.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const otherLinks = [
    { label: dict.nav.events, href: "/events" },
    { label: dict.nav.blog, href: "/blog" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  const PRACTICE_CARDS = [
    {
      label: dict.nav.practiceItems.breathingCircle,
      href: "/practice/breathing-circle",
    },
    {
      label: dict.nav.practiceItems.breathTimer,
      href: "/practice/breath-timer",
    },
  ];

  return (
    <footer
      className="relative overflow-hidden px-6 pt-24 pb-8 text-[var(--nav-overlay-text)] md:px-10"
      style={{ fontFamily: "var(--font-jost), sans-serif" }}
    >
      {/* drifting wavy-line motif, positioned above the bottom edge — a
          repeating background image so it always spans edge-to-edge of the
          viewport with no gap, no matter how wide the screen is */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-5 z-10 h-[90px] animate-[footerWaveDrift_16s_linear_infinite]"
        style={{
          backgroundImage: `url("${WAVE_TILE_DATA_URL}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "400px 90px",
        }}
      />

      <FooterReveal>
        <div className="relative mx-auto flex w-full flex-1 flex-col justify-center">
          <div className="relative grid w-full grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
            <div>
              <Logo className="mb-6 h-8 w-auto" />
            </div>

            <div>
              <h3 className="mb-3 text-xs font-medium tracking-[0.22em] text-[var(--nav-overlay-text)]/65 uppercase">
                {dict.footer.programs}
              </h3>
              <ul className="flex flex-col gap-1">
                {programs.map((program, i) => (
                  <li key={program.id}>
                    <FooterNavLink
                      number={String(i + 1).padStart(2, "0")}
                      label={program.name}
                      href={`/programs/${program.slug}`}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-medium tracking-[0.22em] text-[var(--nav-overlay-text)]/65 uppercase">
                {dict.footer.pages}
              </h3>
              <ul className="flex flex-col gap-1">
                {otherLinks.map((link, i) => (
                  <li key={link.href}>
                    <FooterNavLink
                      number={String(i + 1).padStart(2, "0")}
                      label={link.label}
                      href={link.href}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14">
            <FooterNavLink number="01" label={dict.nav.practice} href="/practice" />
            <PracticeCardsGrid
              practiceCards={PRACTICE_CARDS}
              cardsClassName="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
              uniformHeight
            />
          </div>
        </div>

        <div className="relative mx-auto mt-10 flex w-full flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-5 text-xs tracking-[0.16em] uppercase">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-70"
            >
              <InstagramIcon className="h-[18px] w-[18px]" />
            </a>
            <ContactLink className="hover:opacity-70" />
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-5 text-xs tracking-[0.06em] opacity-70">
            <span>© Martina Briški {new Date().getFullYear()}</span>
            <a
              href="#top"
              className="uppercase tracking-widest hover:opacity-100"
            >
              {dict.footer.backToTop}
            </a>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
