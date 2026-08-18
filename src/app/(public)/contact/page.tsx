import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import MiniFooter from "@/components/MiniFooter";
import { getLocale, getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { CONTACT_SETTINGS_ID } from "@/lib/contactSettings";
import { getAltMap } from "@/lib/mediaAlt";

const DEFAULT_STUDIO_PHOTO =
  "https://pub-1144190a4cb1457da1471034790b3b55.r2.dev/media/Fotke gradske -14.jpg";
const DEFAULT_LABEL = "Kontakt";
const DEFAULT_HEADING = "Piši mi!";
const DEFAULT_TEXT =
  "Ako imaš pitanje, želiš više detalja o programima ili te zanima suradnja — ispuni formu ili piši direktno na";
const DEFAULT_NOTE =
  "Na poruke se trudim odgovoriti unutar 72 sata. Ako u tom periodu ne dobiješ odgovor, velike su šanse da nisam primila tvoju poruku ili e-mail i molim te da ga pošalješ ponovno.";
const DEFAULT_EMAIL = "info@martina-briski.com";
const DEFAULT_MAP_ADDRESS = "Ilica 42, Zagreb";

export default async function ContactPage() {
  const [locale, settings] = await Promise.all([
    getLocale(),
    prisma.contactSettings.findUnique({ where: { id: CONTACT_SETTINGS_ID } }),
  ]);
  const dict = getDictionary(locale);

  const heroPhoto = settings?.heroPhoto || DEFAULT_STUDIO_PHOTO;
  const altMap = await getAltMap([heroPhoto]);
  const label = settings?.label || DEFAULT_LABEL;
  const heading = settings?.heading || DEFAULT_HEADING;
  const text = settings?.text || DEFAULT_TEXT;
  const note = settings?.note || DEFAULT_NOTE;
  const email = settings?.email || DEFAULT_EMAIL;
  const mapAddress = settings?.mapAddress || DEFAULT_MAP_ADDRESS;

  return (
    <>
      <main className="w-full flex-1 bg-[var(--nav-bg)] text-[var(--nav-overlay-text)]">
        {/* Hero photo */}
        <section className="relative h-[calc(100vh-72px)] w-full overflow-hidden">
          <Image
            src={heroPhoto}
            alt={altMap[heroPhoto] ?? ""}
            fill
            priority
            className="object-cover grayscale"
          />
          <div
            className="absolute top-6 left-6 flex items-center gap-2 text-[#F7F5EF] md:top-8 md:left-10"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            <span className="text-[16px] font-light">[</span>
            <span
              className="text-[13px] font-medium tracking-[0.25em] uppercase"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              {label}
            </span>
            <span className="text-[16px] font-light">]</span>
          </div>
        </section>

        <div className="mx-auto max-w-[1267px] px-6 md:px-10">
          {/* Hero text */}
          <section className="pt-10 md:pt-14">
            <h1
              className="max-w-[20ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {heading}
            </h1>
            <p className="mt-[18px] w-full text-base leading-relaxed text-[var(--nav-overlay-text)]/70">
              {text}{" "}
              <a
                href={`mailto:${email}`}
                className="text-[var(--nav-overlay-text)] underline hover:text-[var(--nav-highlight)]"
              >
                {email}
              </a>
              .
            </p>
            {note && (
              <p className="mt-3 w-full text-base leading-relaxed text-[var(--nav-overlay-text)]/70">
                {note}
              </p>
            )}
          </section>

          {/* Form */}
          <section className="flex flex-col gap-8 py-16 md:gap-14 md:py-24">
            <ContactForm />
          </section>

          {/* Map */}
          <section className="pb-16 md:pb-24">
            <div className="relative ml-[calc(-1*(24px+max(0px,50vw_-_633.5px)))] h-[80vh] w-[calc(100%+48px+2*max(0px,50vw_-_633.5px))] overflow-hidden md:ml-[calc(-1*(40px+max(0px,50vw_-_633.5px)))] md:h-[440px] md:w-[calc(100%+80px+2*max(0px,50vw_-_633.5px))]">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
                title={`Lokacija studija — ${mapAddress}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale"
                style={{ border: 0 }}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[var(--nav-bg)]"
                style={{ mixBlendMode: "color" }}
              />
            </div>
          </section>
        </div>
      </main>
      <MiniFooter backToTopLabel={dict.footer.backToTop} />
    </>
  );
}
