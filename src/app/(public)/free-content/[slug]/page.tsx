import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EbookDownloadForm from "@/components/EbookDownloadForm";
import { getAltMap } from "@/lib/mediaAlt";

export default async function EbookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ebook = await prisma.ebook.findUnique({ where: { slug } });

  if (!ebook || !ebook.published) {
    notFound();
  }

  const description = ebook.longDescription || ebook.description;
  const altMap = await getAltMap([ebook.thumbnail]);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      {/* ===================== HERO: full-bleed photo, fills navbar+screen ===================== */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-[#D8D5C7] md:h-[calc(100vh-72px)]">
        {ebook.thumbnail && (
          <Image
            src={ebook.thumbnail}
            alt={altMap[ebook.thumbnail] ?? ebook.title}
            fill
            priority
            className="object-cover"
          />
        )}
        <Link
          href="/free-content"
          className="absolute top-6 right-6 text-sm text-white/80 hover:text-white md:top-8 md:right-10"
        >
          ← Sav besplatan sadržaj
        </Link>
        <div
          className="absolute top-6 left-6 flex items-center gap-2 text-[#F7F5EF] md:top-8 md:left-10"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
        >
          <span className="text-[16px] font-light">[</span>
          <span
            className="text-[13px] font-black tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            Besplatan sadržaj
          </span>
          <span className="text-[16px] font-light">]</span>
        </div>
      </section>

      <div className="mx-auto max-w-[800px] px-6 py-14 md:px-10 md:py-20">
        <h1
          className="mb-6 text-[clamp(28px,4vw,46px)] leading-[1.2] font-normal"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          {ebook.title}
        </h1>

        {description && (
          <p className="max-w-[65ch] text-[15px] leading-[1.75] whitespace-pre-wrap text-[#3B443F]">
            {description}
          </p>
        )}

        <EbookDownloadForm ebookId={ebook.id} />
      </div>
    </main>
  );
}
