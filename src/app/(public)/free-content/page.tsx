import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { FREE_CONTENT_SETTINGS_ID } from "@/lib/freeContentSettings";

export default async function FreeContentPage() {
  const [ebooks, settings] = await Promise.all([
    prisma.ebook.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.freeContentSettings.findUnique({
      where: { id: FREE_CONTENT_SETTINGS_ID },
    }),
  ]);
  const coverImage = settings?.coverImage ?? null;
  const description = settings?.description ?? null;

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] px-6 text-[var(--nav-dark-text)] md:px-10">
      {/* Hero */}
      {coverImage ? (
        <>
          <section className="relative -mx-6 h-[calc(100vh-72px)] md:-mx-10">
            <Image
              src={coverImage}
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-0 left-6 flex h-full items-center py-12 md:left-10">
              <span
                className="text-[15px] font-medium tracking-[0.5em] text-[#F7F5EF] uppercase [writing-mode:vertical-rl]"
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                Besplatan sadržaj
              </span>
            </div>
          </section>
          <div className="mx-auto max-w-[1267px]">
            <section className="pt-10 md:pt-14">
              <h1
                className="max-w-[20ch] text-[clamp(36px,4.6vw,60px)] leading-[1.1] font-normal"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                Vodiči i materijali za tvoju praksu
              </h1>
              <p
                className="mt-4 max-w-[62ch] text-base leading-relaxed whitespace-pre-wrap text-[var(--nav-dark-text)]/70"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {description ||
                  "Preuzmi besplatne PDF vodiče — za disanje, praksu kod kuće i početak s jogom."}
              </p>
            </section>
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-[1267px]">
          <section className="pt-14 md:pt-20">
            <div
              className="mb-6 text-xs tracking-[0.28em] text-[var(--accent-clay)] uppercase"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Besplatan sadržaj
            </div>
            <h1
              className="max-w-[20ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              Vodiči i materijali za tvoju praksu
            </h1>
            <p className="mt-4 max-w-[56ch] text-base leading-relaxed whitespace-pre-wrap text-[var(--nav-dark-text)]/70">
              {description ||
                "Preuzmi besplatne PDF vodiče — za disanje, praksu kod kuće i početak s jogom."}
            </p>
          </section>
        </div>
      )}

      <div className="mx-auto max-w-[1267px]">
        {ebooks.length === 0 ? (
          <div className="py-16 text-center text-[var(--nav-dark-text)]/70">
            Trenutno nema dostupnog sadržaja.
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-[18px] py-16 sm:grid-cols-2 md:py-24">
            {ebooks.map((ebook) => (
              <a
                key={ebook.id}
                href={ebook.pdfUrl}
                download={ebook.pdfFilename}
                className="group relative block aspect-4/5 overflow-hidden rounded-2xl"
              >
                {ebook.thumbnail ? (
                  <Image
                    src={ebook.thumbnail}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#D8D5C7]" />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(23,20,15,0.88), rgba(23,20,15,0.2) 55%, rgba(23,20,15,0))",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3.5 p-[18px] md:p-6">
                  <div>
                    <div
                      className="text-[clamp(18px,2vw,21px)] leading-[1.25] text-[#F7F5EF]"
                      style={{ fontFamily: "var(--font-marcellus), serif" }}
                    >
                      {ebook.title}
                    </div>
                    {ebook.description && (
                      <div className="mt-2 max-w-[30ch] text-[13px] leading-relaxed text-[#F7F5EF]/80">
                        {ebook.description}
                      </div>
                    )}
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--nav-highlight)] px-[18px] py-3 text-[11.5px] font-medium tracking-[0.14em] text-[var(--nav-dark-text)] uppercase"
                    style={{ fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    Preuzmi PDF ↓
                  </span>
                </div>
              </a>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
