import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ABOUT_ID, parseSteps } from "@/lib/about";
import AboutTestimonialsCarousel from "@/components/AboutTestimonialsCarousel";
import { getAltMap } from "@/lib/mediaAlt";

export default async function AboutPage() {
  const [about, programs, testimonials] = await Promise.all([
    prisma.about.findUnique({ where: { id: ABOUT_ID } }),
    prisma.program.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!about || !about.published) {
    notFound();
  }

  const [intro, ...sections] = parseSteps(about.steps);
  const marqueeWords = intro.subtitle
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);
  const marqueeLine =
    marqueeWords.length > 0 ? marqueeWords.join("  /  ") : "";

  const altMap = await getAltMap([
    about.thumbnail,
    intro.image,
    ...programs.map((p) => p.thumbnail),
  ]);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      {/* Hero */}
      {about.thumbnail ? (
        <>
          <section className="relative h-[calc(100vh-72px)] w-full overflow-hidden">
            <Image
              src={about.thumbnail}
              alt={altMap[about.thumbnail] ?? ""}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
            />
            {intro.title && (
              <div
                className="absolute top-6 left-6 flex items-center gap-2 text-[#F7F5EF] md:top-8 md:left-10"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
              >
                <span className="text-[16px] font-light">[</span>
                <span
                  className="text-[13px] font-medium tracking-[0.25em] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {intro.title}
                </span>
                <span className="text-[16px] font-light">]</span>
              </div>
            )}
          </section>
          {intro.subtitle && (
            <section className="px-6 pt-10 md:px-10">
              <div className="mx-auto max-w-[1267px]">
                <h1
                  className="max-w-[15ch] text-[clamp(32px,4.6vw,60px)] leading-[1.12] font-normal"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  {intro.subtitle}
                </h1>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="px-6 pt-14 md:px-10 md:pt-20">
          <div className="mx-auto max-w-[1267px]">
          {intro.title && (
            <div
              className="mb-6 text-xs tracking-[0.28em] text-[var(--nav-bg)] uppercase"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              (01) &nbsp; {intro.title}
            </div>
          )}
          {intro.subtitle && (
            <h1
              className="max-w-[15ch] text-[clamp(32px,4.6vw,60px)] leading-[1.12] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {intro.subtitle}
            </h1>
          )}
          </div>
        </section>
      )}

      {/* Marquee */}
      {marqueeLine && (
        <section className="my-14 overflow-hidden py-4 whitespace-nowrap">
          <div className="inline-flex animate-[marquee_26s_linear_infinite] will-change-transform">
            {[0, 1].map((rep) => (
              <span
                key={rep}
                className="text-[clamp(42px,6.5vw,74px)] tracking-[0.14em] text-[var(--nav-bg)] uppercase"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {marqueeLine} &nbsp;/&nbsp; {marqueeLine} &nbsp;/&nbsp;
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Intro two-col */}
      {(intro.image || intro.description) && (
        <section className="px-6 pb-4 md:px-10">
        <div className="mx-auto grid max-w-[1267px] grid-cols-1 items-center gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          {intro.image && (
            <div className="relative aspect-4/5 overflow-hidden bg-[#D8D5C7]">
              <Image src={intro.image} alt={altMap[intro.image] ?? ""} fill className="object-cover" />
            </div>
          )}
          <div>
            <div
              className="mb-6 text-sm tracking-[0.2em] text-[var(--nav-bg)]"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              (01)
            </div>
            {intro.description && (
              <p
                className="max-w-[60ch] text-[17px] leading-[1.75] whitespace-pre-wrap"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {intro.description}
              </p>
            )}
            {about.pdfUrl && (
              <a
                href={about.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-medium tracking-[0.06em] text-[var(--nav-bg)] underline underline-offset-4 hover:opacity-70"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                Pročitaj više
              </a>
            )}
          </div>
        </div>
        </section>
      )}

      {/* Numbered sections */}
      {sections.some((s) => s.title || s.description) && (
        <section className="px-6 pt-[clamp(70px,9vw,130px)] pb-[clamp(70px,9vw,130px)] md:px-10">
        <div className="mx-auto flex max-w-[1267px] flex-col gap-[clamp(60px,8vw,110px)]">
          {sections.map((step, i) =>
            step.title || step.description ? (
              <div
                key={i}
                className="grid grid-cols-1 gap-6 md:grid-cols-[0.4fr_1fr] md:gap-14"
              >
                <div>
                  <div
                    className="text-sm tracking-[0.2em] text-[var(--nav-bg)]"
                    style={{ fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    (0{i + 2})
                  </div>
                  {step.title && (
                    <h2
                      className="mt-3 text-[clamp(24px,3vw,34px)] leading-[1.1] font-normal"
                      style={{ fontFamily: "var(--font-marcellus), serif" }}
                    >
                      {step.title}
                    </h2>
                  )}
                </div>
                <div className="pt-2">
                  {step.subtitle && (
                    <p
                      className="mb-3 text-xs tracking-[0.14em] text-[var(--nav-bg)] uppercase"
                      style={{ fontFamily: "var(--font-jost), sans-serif" }}
                    >
                      {step.subtitle}
                    </p>
                  )}
                  {step.description && (
                    <p
                      className="mt-4 max-w-[62ch] text-base leading-relaxed whitespace-pre-wrap text-[var(--nav-dark-text)]/70"
                      style={{ fontFamily: "var(--font-jost), sans-serif" }}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ) : null,
          )}
        </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <AboutTestimonialsCarousel testimonials={testimonials} />
      )}

      {/* Programs CTA */}
      {programs.length > 0 && (
        <section className="px-6 py-[clamp(70px,9vw,130px)] md:px-10">
        <div className="mx-auto max-w-[1267px]">
          <div>
            <div
              className="mb-4 text-xs tracking-[0.28em] text-[var(--nav-bg)] uppercase"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Istraži programe
            </div>
            <h2
              className="max-w-[16ch] text-[clamp(24px,3vw,34px)] leading-[1.1] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              Saznaj više o programima i odaberi ono što ti najviše odgovara.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-[18px] md:grid-cols-3">
            {programs.map((program, i) => (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="relative flex min-h-[200px] flex-col justify-between overflow-hidden border border-[#D5D2C4] bg-[#D8D5C7] p-[26px] transition-colors hover:border-[var(--nav-bg)]"
              >
                {program.thumbnail && (
                  <Image
                    src={program.thumbnail}
                    alt={altMap[program.thumbnail] ?? program.name}
                    fill
                    className="object-cover grayscale"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(23,20,15,0.75), rgba(23,20,15,0.15) 55%, rgba(23,20,15,0.35))",
                  }}
                />
                <span
                  className="relative z-10 text-xs tracking-[0.2em] text-[var(--nav-highlight)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="relative z-10 text-[clamp(19px,2vw,22px)] leading-[1.2] text-[#F7F5EF]"
                  style={{ fontFamily: "var(--font-marcellus), serif" }}
                >
                  {program.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
        </section>
      )}

      {/* PDF CTA */}
      {about.pdfUrl && (
        <section className="bg-[var(--nav-bg)] px-6 py-[clamp(60px,8vw,110px)] text-center text-[var(--nav-overlay-text)] md:px-10">
          <div className="mx-auto max-w-[720px]">
            <div
              className="mb-4 text-xs tracking-[0.28em] uppercase opacity-70"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Želiš znati više?
            </div>
            <h2
              className="mb-8 text-[clamp(24px,3vw,34px)] leading-[1.2] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              Pročitaj cijelu priču i saznaj što stoji iza prakse.
            </h2>
            <a
              href={about.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-[var(--nav-highlight)] px-[26px] py-3.5 text-xs font-medium tracking-[0.24em] text-[var(--nav-dark-text)] uppercase transition-colors duration-[250ms] hover:bg-[var(--nav-highlight-dark)]"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Pročitaj više
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
