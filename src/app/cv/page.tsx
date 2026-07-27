import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CV_ID } from "@/lib/cv";

// Not linked from anywhere on the site (no nav/footer entry) — this is a
// standalone page meant to be shared directly with clients, so it's kept
// out of search results too.
export const metadata: Metadata = {
  title: "CV",
  robots: { index: false, follow: false },
};

export default async function CvPage() {
  const cv = await prisma.cv.findUnique({ where: { id: CV_ID } });

  const title = cv?.title ?? "Martina Briški";
  const subtitle = cv?.subtitle ?? "";
  const description = cv?.description ?? "";

  return (
    <main className="min-h-screen w-full bg-[var(--nav-overlay-text)] px-6 py-16 text-[var(--nav-dark-text)] md:px-10 md:py-24">
      <div className="mx-auto max-w-[760px]">
        <h1
          className="text-[clamp(32px,5vw,52px)] leading-[1.1] font-normal"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-3 text-sm tracking-[0.1em] text-[var(--accent-clay)] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            {subtitle}
          </p>
        )}
        <div className="mt-10 h-px bg-[#D5D2C4]" />
        {description && (
          <div
            className="blog-article prose prose-neutral mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </main>
  );
}
