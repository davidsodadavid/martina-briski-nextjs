import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseSteps } from "@/lib/program";
import ProgramPathSteps from "@/components/ProgramPathSteps";
import ProgramGallerySlider from "@/components/ProgramGallerySlider";
import { getAltMap } from "@/lib/mediaAlt";

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
  const altMap = await getAltMap([
    program.thumbnail,
    ...program.galleryImages,
  ]);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      {/* ===================== HERO: full-bleed photo, fills navbar+screen ===================== */}
      <section className="relative h-[calc(100vh-72px)] w-full overflow-hidden bg-[#D8D5C7]">
        {program.thumbnail && (
          <Image
            src={program.thumbnail}
            alt={altMap[program.thumbnail] ?? program.name}
            fill
            priority
            className="object-cover grayscale"
          />
        )}
        <div
          className="absolute top-6 left-6 flex items-center gap-2 text-[#F7F5EF] md:top-8 md:left-10"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
        >
          <span className="text-[16px] font-light">[</span>
          <span
            className="text-[13px] font-medium tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            {program.name}
          </span>
          <span className="text-[16px] font-light">]</span>
        </div>
      </section>

      <div className="relative mx-auto max-w-[1267px]">
        <section className="px-6 pt-10 md:px-10 md:pt-14">
          <h1
            className="max-w-[20ch] text-[clamp(28px,4vw,46px)] leading-[1.1] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            {program.name}
          </h1>
        </section>

        {/* ===================== ABOUT ===================== */}
        {(program.description || program.tags.length > 0) && (
          <section className="px-6 pt-6 md:px-10">
            {program.description && (
              <p
                className="mt-4 max-w-[62ch] text-base leading-relaxed whitespace-pre-wrap text-[var(--nav-dark-text)]/70"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {program.description}
              </p>
            )}
            {program.tags.length > 0 && (
              <div className="mt-[22px] flex flex-wrap gap-[10px]">
                {program.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#E7E3D4] px-3.5 py-1.5 text-xs text-[#3B443F]"
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
            <ProgramPathSteps steps={steps} />
          </section>
        )}

        {/* ===================== GALLERY: full-bleed auto-advancing slideshow ===================== */}
        {program.galleryImages.length > 0 && (
          <section className="pt-14 md:pt-20">
            <ProgramGallerySlider
              images={program.galleryImages}
              altMap={altMap}
              fallbackAlt={program.name}
            />
          </section>
        )}

        {/* ===================== PDF DOWNLOAD ===================== */}
        {program.pdfUrl && (
          <section className="px-6 pt-14 md:px-10 md:pt-20">
            <div className="flex flex-wrap items-center justify-between gap-5 border border-[#D5D2C4] bg-[var(--nav-overlay-text)] p-6 md:p-8">
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
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--nav-highlight)] px-6 py-3.5 text-xs font-medium tracking-[0.18em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
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
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--nav-highlight)] px-[30px] py-[15px] text-xs font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
          >
            Javi se
          </Link>
        </section>
      </div>
    </main>
  );
}
