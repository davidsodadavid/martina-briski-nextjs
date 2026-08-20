import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { stripHtml, truncate } from "@/lib/text";
import SubscribeForm from "@/components/SubscribeForm";
import PostGrid from "@/components/PostGrid";
import { getLocale, getDictionary } from "@/lib/i18n";
import { BLOG_SETTINGS_ID } from "@/lib/blogSettings";
import { getAltMap } from "@/lib/mediaAlt";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [categories, locale, blogSettings] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ createdAt: "asc" }, { id: "asc" }] }),
    getLocale(),
    prisma.blogSettings.findUnique({ where: { id: BLOG_SETTINGS_ID } }),
  ]);
  const activeCategory =
    category && categories.some((c) => c.id === category) ? category : "ALL";

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(activeCategory === "ALL" ? {} : { categoryId: activeCategory }),
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  const coverImage = blogSettings?.coverImage ?? null;
  const description = blogSettings?.description ?? null;
  const dict = getDictionary(locale);
  const photoCredit = blogSettings?.photoCredit || dict.home.photoCredit;
  const label = blogSettings?.label || dict.home.label;
  const dateLocale = locale === "en" ? "en-GB" : "hr-HR";

  const FILTERS: { value: string; label: string }[] = [
    { value: "ALL", label: dict.home.filterAll },
    ...categories.map((c) => ({ value: c.id, label: c.label })),
  ];

  const [featured, ...rest] = posts;
  const altMap = await getAltMap([
    coverImage,
    ...posts.map((p) => p.thumbnail),
  ]);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] px-6 text-[var(--nav-dark-text)] md:px-10">
      <div className="mx-auto w-full">
        {/* Hero */}
        {coverImage ? (
          <>
            <section className="relative -mx-6 h-[calc(100vh-72px)] md:-mx-10">
              <Image
                src={coverImage}
                alt={altMap[coverImage] ?? ""}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-6 left-6 bg-[var(--nav-overlay-text)] px-4 py-2 md:top-8 md:left-10">
                <span
                  className="text-[13px] font-medium tracking-[0.25em] text-[var(--nav-dark-text)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {label}
                </span>
              </div>
            </section>
            <section className="pt-10 md:pt-14">
              <h1
                className="max-w-[20ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {dict.home.title}
              </h1>
              {description && (
                <p
                  className="mt-4 max-w-[62ch] leading-[1.7] whitespace-pre-wrap text-[15px] text-[var(--nav-dark-text)]/80"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {description}
                </p>
              )}
              <p
                className="mt-4 text-[13px] italic text-[#8A8371]"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {photoCredit}
              </p>
            </section>
          </>
        ) : (
          <section className="pt-14 md:pt-20">
            <div
              className="mb-6 text-xs tracking-[0.28em] text-[var(--accent-clay)] uppercase"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              {label}
            </div>
            <h1
              className="max-w-[20ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {dict.home.title}
            </h1>
            {description && (
              <p
                className="mt-4 max-w-[62ch] leading-[1.7] whitespace-pre-wrap text-[15px] text-[var(--nav-dark-text)]/80"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {description}
              </p>
            )}
            <p
              className="mt-4 text-[13px] italic text-[#8A8371]"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              {photoCredit}
            </p>
          </section>
        )}

        {/* Filters */}
        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value === "ALL" ? "/blog" : `/blog?category=${f.value}`}
              className={`px-3.5 py-1.5 text-sm font-medium ${
                activeCategory === f.value
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
                className="relative block aspect-4/5 overflow-hidden sm:aspect-21/9"
              >
                <div className="absolute inset-0 bg-[#D8D5C7]">
                  {featured.thumbnail && (
                    <Image
                      src={featured.thumbnail}
                      alt={altMap[featured.thumbnail] ?? featured.title}
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
                      className="bg-[var(--nav-highlight)]/15 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-[var(--nav-highlight)] uppercase"
                      style={{ fontFamily: "var(--font-jost), sans-serif" }}
                    >
                      {featured.category?.label ?? "Ostalo"}
                    </span>
                    <span className="text-xs text-[#F7F5EF]/70">
                      {featured.createdAt.toLocaleDateString(dateLocale)}
                    </span>
                  </div>
                  <div
                    className="max-w-[32ch] text-[clamp(24px,3vw,34px)] leading-[1.15] text-[#F7F5EF]"
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
            {rest.length > 0 && <PostGrid posts={rest} altMap={altMap} />}

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
