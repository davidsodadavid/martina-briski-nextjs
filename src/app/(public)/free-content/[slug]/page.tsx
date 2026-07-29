import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      <div className="mx-auto max-w-[800px] px-6 py-14 md:px-10 md:py-20">
        <Link
          href="/free-content"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-[var(--nav-dark-text)]/60 uppercase hover:text-[var(--nav-dark-text)]"
        >
          ← Sav besplatan sadržaj
        </Link>

        <h1
          className="mt-7 mb-6 text-[clamp(28px,4vw,46px)] leading-[1.2] font-normal"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          {ebook.title}
        </h1>

        {ebook.thumbnail && (
          <div className="relative aspect-4/5 w-full overflow-hidden sm:aspect-21/9">
            <Image
              src={ebook.thumbnail}
              alt=""
              fill
              className="object-cover grayscale"
            />
          </div>
        )}

        {ebook.description && (
          <p className="mt-8 max-w-[65ch] text-[15px] leading-[1.75] whitespace-pre-wrap text-[#3B443F]">
            {ebook.description}
          </p>
        )}

        <a
          href={ebook.pdfUrl}
          download={ebook.pdfFilename}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--nav-highlight)] px-[30px] py-[15px] text-xs font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
        >
          Preuzmi PDF ↓
        </a>
      </div>
    </main>
  );
}
