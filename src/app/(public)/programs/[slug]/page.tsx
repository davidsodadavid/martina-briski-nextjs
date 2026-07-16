import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseSteps } from "@/lib/program";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await prisma.program.findUnique({ where: { slug } });

  if (!program || !program.published) {
    notFound();
  }

  const steps = parseSteps(program.steps).filter((s) => s.title);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      <div className="relative mx-auto max-w-[1267px]">
        {/* ===================== HERO: full-bleed grayscale photo ===================== */}
        <div className="relative aspect-21/9 w-full overflow-hidden bg-[#D8D5C7]">
          {program.thumbnail && (
            <Image
              src={program.thumbnail}
              alt={program.name}
              fill
              className="object-cover grayscale"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(23,20,15,0.82), rgba(23,20,15,0.1) 55%, rgba(23,20,15,0))",
            }}
          />
          <Link
            href="/"
            className="absolute top-6 left-6 text-sm text-white/80 hover:text-white md:top-8 md:left-10"
          >
            ← Natrag na početnu
          </Link>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3.5 p-6 md:p-12">
            <div
              className="text-xs tracking-[0.28em] text-[var(--nav-highlight)] uppercase"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              program — {program.name.toLowerCase()}
            </div>
            <h1
              className="max-w-[20ch] text-[clamp(30px,4.4vw,54px)] leading-[1.1] font-normal text-[#F7F5EF]"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {program.name}
            </h1>
          </div>
        </div>

        {/* ===================== ABOUT ===================== */}
        {(program.description || program.tags.length > 0) && (
          <section className="px-6 pt-10 md:px-10 md:pt-14">
            {program.description && (
              <p className="max-w-[68ch] text-[clamp(16px,1.3vw,18px)] leading-[1.7] text-[#3B443F]">
                {program.description}
              </p>
            )}
            {program.tags.length > 0 && (
              <div className="mt-[22px] flex flex-wrap gap-[10px]">
                {program.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#E7E3D4] px-3.5 py-1.5 text-xs text-[#3B443F]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===================== STEPS ===================== */}
        {steps.length > 0 && (
          <section className="px-6 pt-14 md:px-10 md:pt-20">
            <h2
              className="mb-[30px] text-[clamp(22px,2.6vw,30px)] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              Kako izgleda program
            </h2>
            <div className="grid grid-cols-1 gap-[clamp(20px,2.4vw,28px)] sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div
                    className="text-[34px] text-[var(--accent-clay)]"
                    style={{ fontFamily: "var(--font-marcellus), serif" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="text-[19px]"
                    style={{ fontFamily: "var(--font-marcellus), serif" }}
                  >
                    {step.title}
                  </div>
                  {(step.description || step.subtitle) && (
                    <div className="text-sm leading-[1.6] text-[#55605B]">
                      {step.description || step.subtitle}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================== GALLERY: single full-bleed grayscale photo ===================== */}
        {program.galleryImage && (
          <section className="pt-14 md:pt-20">
            <h2
              className="mb-6 px-6 text-[clamp(22px,2.6vw,30px)] font-normal md:px-10"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              Iz prakse
            </h2>
            <div className="relative aspect-21/9 w-full overflow-hidden">
              <Image
                src={program.galleryImage}
                alt=""
                fill
                className="object-cover grayscale"
              />
            </div>
          </section>
        )}

        {/* ===================== PDF DOWNLOAD ===================== */}
        {program.pdfUrl && (
          <section className="px-6 pt-14 md:px-10 md:pt-20">
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#D5D2C4] bg-[#F3F1E9] p-6 md:p-8">
              <div>
                <div
                  className="text-[clamp(19px,2vw,22px)]"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  Vodič kroz program
                </div>
                <div className="mt-1.5 max-w-[52ch] text-sm leading-[1.6] text-[#55605B]">
                  Pregled struktura sati, što ponijeti i kako se pripremiti za
                  prvi dolazak.
                </div>
              </div>
              <a
                href={program.pdfUrl}
                download={program.pdfFilename ?? undefined}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--nav-highlight)] px-6 py-3.5 text-xs font-medium tracking-[0.18em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
              >
                Preuzmi PDF ↓
              </a>
            </div>
          </section>
        )}

        {/* ===================== CTA ===================== */}
        <section className="px-6 pt-14 pb-[clamp(70px,8vw,110px)] text-center md:px-10 md:pt-20">
          <h2
            className="mx-auto mb-[22px] max-w-[24ch] text-[clamp(24px,3vw,34px)] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            Zainteresirani ste za ovaj program?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--nav-highlight)] px-[30px] py-[15px] text-xs font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
          >
            Javi se
          </Link>
        </section>
      </div>
    </main>
  );
}
