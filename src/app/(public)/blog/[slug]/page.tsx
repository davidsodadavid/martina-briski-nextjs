import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ABOUT_ID } from "@/lib/about";
import { CATEGORY_LABELS } from "@/lib/postCategory";
import { estimateReadTime } from "@/lib/text";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || !post.published) {
    notFound();
  }

  const [about, sameType, others] = await Promise.all([
    prisma.about.findUnique({ where: { id: ABOUT_ID } }),
    prisma.post.findMany({
      where: { published: true, type: post.type, id: { not: post.id } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.post.findMany({
      where: { published: true, id: { not: post.id } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const related = [...sameType, ...others]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 3);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      <div className="mx-auto max-w-[1267px] px-6 md:px-10">
        {/* Back link */}
        <section className="pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-[var(--nav-bg)] uppercase hover:underline"
          >
            ← Sve objave
          </Link>
        </section>

        {/* Title */}
        <section className="max-w-[800px] pt-7">
          <div className="mb-[18px] flex flex-wrap items-center gap-3">
            <span
              className="rounded-full bg-[#E7E3D4] px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-[var(--accent-clay)] uppercase"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              {CATEGORY_LABELS[post.type]}
            </span>
            <span className="text-[13px] text-[#8A8371]">
              {post.createdAt.toLocaleDateString("hr-HR")}
            </span>
            <span className="h-[3px] w-[3px] rounded-full bg-[#C3BCA9]" />
            <span className="text-[13px] text-[#8A8371]">
              {estimateReadTime(post.content)}
            </span>
          </div>
          <h1
            className="mb-5 text-[clamp(28px,4vw,46px)] leading-[1.2] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#D8D5C7]">
              {about?.thumbnail && (
                <Image
                  src={about.thumbnail}
                  alt="Martina Briški"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <div
                className="text-[15px]"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                Martina Briški
              </div>
              <div className="text-[12.5px] text-[#8A8371]">
                Instruktorica joge i disanja
              </div>
            </div>
          </div>
        </section>

        {/* Featured image */}
        {post.thumbnail && (
          <section className="pt-8 md:pt-11">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-[18px] sm:aspect-21/9">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover grayscale"
              />
            </div>
          </section>
        )}

        {/* Article body */}
        <section className="grid grid-cols-1 gap-8 pt-10 pb-16 md:grid-cols-[1.7fr_1fr] md:gap-14 md:pt-14 md:pb-20">
          <article className="max-w-[720px]">
            <div
              className="blog-article prose prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Related posts sidebar */}
          {related.length > 0 && (
            <aside className="flex flex-col gap-5">
              <div
                className="text-[11px] font-medium tracking-[0.18em] text-[#6B6458] uppercase"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                Još za pročitati
              </div>
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="grid grid-cols-[76px_1fr] items-center gap-3.5"
                >
                  <div className="relative h-[76px] w-[76px] overflow-hidden rounded-[10px] bg-[#D8D5C7]">
                    {rel.thumbnail && (
                      <Image
                        src={rel.thumbnail}
                        alt={rel.title}
                        fill
                        className="object-cover grayscale"
                      />
                    )}
                  </div>
                  <div>
                    <div
                      className="text-[15px] leading-[1.3]"
                      style={{ fontFamily: "var(--font-marcellus), serif" }}
                    >
                      {rel.title}
                    </div>
                    <div className="mt-1 text-[11.5px] text-[#8A8371]">
                      {rel.createdAt.toLocaleDateString("hr-HR")}
                    </div>
                  </div>
                </Link>
              ))}
            </aside>
          )}
        </section>
      </div>
    </main>
  );
}
