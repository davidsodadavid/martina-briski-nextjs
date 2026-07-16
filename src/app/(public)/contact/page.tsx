import Image from "next/image";
import ContactForm from "@/components/ContactForm";

const STUDIO_PHOTO =
  "https://pub-1144190a4cb1457da1471034790b3b55.r2.dev/media/Fotke gradske -14.jpg";

export default function ContactPage() {
  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      <div className="mx-auto max-w-[1267px] px-6 md:px-10">
        {/* Hero */}
        <section className="pt-14 md:pt-20">
          <div
            className="mb-6 text-xs tracking-[0.28em] text-[var(--accent-clay)] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            Kontakt
          </div>
          <h1
            className="max-w-[20ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            Javite se, rado ću odgovoriti
          </h1>
          <p className="mt-[18px] max-w-[56ch] text-base leading-relaxed text-[#6B6458]">
            Imate pitanje o programima, praksi ili suradnji? Ispunite obrazac
            ili pišite direktno na e-mail.
          </p>
        </section>

        {/* Form + details */}
        <section className="grid grid-cols-1 gap-8 py-16 md:grid-cols-[1.3fr_1fr] md:gap-14 md:py-24">
          <ContactForm />

          <div className="flex flex-col gap-[26px]">
            <div className="flex flex-col gap-[18px] rounded-2xl border border-[#D5D2C4] bg-[#F3F1E9] p-7">
              <div>
                <div
                  className="mb-1.5 text-[11px] font-medium tracking-[0.14em] text-[var(--nav-bg)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  E-mail
                </div>
                <a
                  href="mailto:info@martina-briski.com"
                  className="text-lg"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  info@martina-briski.com
                </a>
              </div>
              <div className="h-px bg-[#D5D2C4]" />
              <div>
                <div
                  className="mb-1.5 text-[11px] font-medium tracking-[0.14em] text-[var(--nav-bg)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  Telefon
                </div>
                <a
                  href="tel:+385915375379"
                  className="text-lg"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  +385 91 537 5379
                </a>
              </div>
              <div className="h-px bg-[#D5D2C4]" />
              <div>
                <div
                  className="mb-1.5 text-[11px] font-medium tracking-[0.14em] text-[var(--nav-bg)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  Studio
                </div>
                <div
                  className="text-lg"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  Studio Zagreb, Ilica 42
                </div>
              </div>
              <div className="h-px bg-[#D5D2C4]" />
              <div>
                <div
                  className="mb-1.5 text-[11px] font-medium tracking-[0.14em] text-[var(--nav-bg)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  Društvene mreže
                </div>
                <div className="mt-1.5 flex gap-[18px]">
                  <a
                    href="https://www.instagram.com/martinabriski/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] hover:underline"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/in/martina-briski/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Full-bleed grayscale photo */}
      <section className="relative aspect-4/5 w-full overflow-hidden sm:aspect-21/9">
        <Image
          src={STUDIO_PHOTO}
          alt="Studio"
          fill
          className="object-cover grayscale"
        />
      </section>
    </main>
  );
}
