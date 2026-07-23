import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ABOUT_ID, parseSteps } from "@/lib/about";
import AboutTestimonialsCarousel from "@/components/AboutTestimonialsCarousel";

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

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      {/* Hero */}
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
            className="max-w-[15ch] text-[clamp(34px,5.4vw,76px)] leading-[1.12] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            {intro.subtitle}
          </h1>
        )}
        </div>
      </section>

      {about.thumbnail && (
        <section className="px-6 pt-10 md:px-10">
          <div className="mx-auto max-w-[1267px]">
          <div className="relative h-[clamp(280px,42vw,560px)] w-full overflow-hidden rounded-2xl bg-[#D8D5C7]">
            <Image
              src={about.thumbnail}
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </div>
          </div>
        </section>
      )}

      {/* Marquee */}
      {marqueeLine && (
        <section className="my-14 overflow-hidden bg-[var(--nav-bg)] py-4 whitespace-nowrap">
          <div className="inline-flex animate-[marquee_26s_linear_infinite] will-change-transform">
            {[0, 1].map((rep) => (
              <span
                key={rep}
                className="text-xl tracking-[0.14em] text-[var(--nav-overlay-text)] uppercase"
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
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-[#D8D5C7]">
              <Image src={intro.image} alt="" fill className="object-cover" />
            </div>
          )}
          <div>
            <div
              className="mb-6 inline-flex rounded-full bg-[var(--nav-bg)] px-3 py-1.5 text-xs font-medium tracking-[0.14em] text-[var(--nav-overlay-text)]"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              01
            </div>
            {intro.description && (
              <p
                className="max-w-[60ch] text-[17px] leading-[1.75] whitespace-pre-wrap"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {intro.description}
              </p>
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
                      className="mt-3 text-[clamp(30px,4vw,52px)] leading-[1.1] font-normal"
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
                    <p className="max-w-[60ch] text-[17px] leading-[1.75] whitespace-pre-wrap opacity-90">
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
              className="max-w-[16ch] text-[clamp(30px,4.4vw,58px)] leading-[1.1] font-normal"
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
                className="flex min-h-[200px] flex-col justify-between rounded-2xl border border-[#D5D2C4] bg-[#F3F1E9] p-[26px] transition-colors hover:border-[var(--nav-bg)]"
              >
                <span
                  className="text-xs tracking-[0.2em] text-[var(--nav-bg)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[clamp(22px,2.4vw,30px)] leading-[1.2]"
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
    </main>
  );
}
