import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PostType } from "@/generated/prisma/enums";
import { stripHtml, truncate } from "@/lib/text";
import SubscribeForm from "@/components/SubscribeForm";
import PostGrid from "@/components/PostGrid";
import { getLocale, getDictionary } from "@/lib/i18n";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeType =
    type && Object.values(PostType).includes(type as PostType)
      ? (type as PostType)
      : "ALL";

  const [posts, locale] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        ...(activeType === "ALL" ? {} : { type: activeType }),
      },
      orderBy: { createdAt: "desc" },
    }),
    getLocale(),
  ]);
  const dict = getDictionary(locale);
  const dateLocale = locale === "en" ? "en-GB" : "hr-HR";

  const FILTERS: { value: PostType | "ALL"; label: string }[] = [
    { value: "ALL", label: dict.home.filterAll },
    { value: PostType.NEWS, label: dict.categories.NEWS },
    { value: PostType.TUTORIAL, label: dict.categories.TUTORIAL },
    { value: PostType.OPINION, label: dict.categories.OPINION },
  ];

  const [featured, ...rest] = posts;

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] px-6 text-[var(--nav-dark-text)] md:px-10">
      <div className="mx-auto max-w-[1267px]">
        {/* Hero */}
        <section className="pt-14 md:pt-20">
          <div
            className="mb-6 text-xs tracking-[0.28em] text-[var(--accent-clay)] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            {dict.home.label}
          </div>
          <h1
            className="max-w-[20ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            {dict.home.title}
          </h1>
        </section>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === "ALL" ? "/" : `/?type=${f.value}`}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                activeType === f.value
                  ? "bg-[var(--nav-highlight)] text-[var(--nav-dark-text)]"
                  : "bg-[#E7E3D4] text-[#3B443F] hover:bg-[#DCD8C6]"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="py-16 text-center text-[var(--nav-dark-text)]/70">
            {dict.home.noPosts}
          </div>
        ) : (
          <>
            {/* Featured post */}
            <section className="pt-10 md:pt-12">
              <Link
                href={`/blog/${featured.slug}`}
                className="relative block aspect-4/5 overflow-hidden rounded-[20px] sm:aspect-21/9"
              >
                <div className="absolute inset-0 bg-[#D8D5C7]">
                  {featured.thumbnail && (
                    <Image
                      src={featured.thumbnail}
                      alt={featured.title}
                      fill
                      className="object-cover grayscale"
                    />
                  )}
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(23,20,15,0.85), rgba(23,20,15,0.15) 55%, rgba(23,20,15,0))",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-11">
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full bg-[var(--nav-highlight)]/15 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-[var(--nav-highlight)] uppercase"
                      style={{ fontFamily: "var(--font-jost), sans-serif" }}
                    >
                      {dict.categories[featured.type]}
                    </span>
                    <span className="text-xs text-[#F7F5EF]/70">
                      {featured.createdAt.toLocaleDateString(dateLocale)}
                    </span>
                  </div>
                  <div
                    className="max-w-[32ch] text-[clamp(24px,3.4vw,38px)] leading-[1.15] text-[#F7F5EF]"
                    style={{ fontFamily: "var(--font-marcellus), serif" }}
                  >
                    {featured.title}
                  </div>
                  <div className="max-w-[56ch] text-[14.5px] leading-[1.6] text-[#F7F5EF]/82">
                    {truncate(stripHtml(featured.content), 160)}
                  </div>
                </div>
              </Link>
            </section>

            {/* Post grid */}
            {rest.length > 0 && <PostGrid posts={rest} />}

            {/* Newsletter — stays within the same content grid as the rest
                of the page, just taller/more prominent */}
            <section>
              <SubscribeForm />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
