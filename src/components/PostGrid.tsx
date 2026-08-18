"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { stripHtml, truncate } from "@/lib/text";
import { useDict, useLocale } from "@/components/LocaleProvider";

const PAGE_SIZE = 6;

type PostCardData = {
  id: string;
  slug: string;
  thumbnail: string | null;
  category: { label: string } | null;
  createdAt: Date;
  title: string;
  content: string;
};

export default function PostGrid({
  posts,
  altMap,
}: {
  posts: PostCardData[];
  altMap: Record<string, string>;
}) {
  const dict = useDict();
  const locale = useLocale();
  const dateLocale = locale === "en" ? "en-GB" : "hr-HR";
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <>
      <section className="grid grid-cols-1 gap-[clamp(20px,2.4vw,28px)] py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex flex-col overflow-hidden border border-[#D5D2C4] bg-[var(--nav-overlay-text)]"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#D8D5C7]">
              {post.thumbnail && (
                <Image
                  src={post.thumbnail}
                  alt={altMap[post.thumbnail] ?? post.title}
                  fill
                  className="object-cover grayscale"
                />
              )}
            </div>
            <div className="flex flex-col gap-2.5 p-[22px]">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[10.5px] font-medium tracking-[0.14em] text-[var(--nav-dark-text)] uppercase"
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {post.category?.label ?? "Ostalo"}
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-[#C3BCA9]" />
                <span className="text-xs text-[#8A8371]">
                  {post.createdAt.toLocaleDateString(dateLocale)}
                </span>
              </div>
              <div
                className="text-[clamp(18px,1.8vw,20px)] leading-[1.3]"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {post.title}
              </div>
              <div className="text-[13.5px] leading-[1.55] text-[#55605B]">
                {truncate(stripHtml(post.content), 110)}
              </div>
              <span
                className="mt-1.5 text-xs font-medium tracking-[0.1em] text-[var(--nav-bg)] uppercase"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {dict.home.readMore}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {hasMore && (
        <div className="flex justify-center pb-12 md:pb-16">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-lg bg-[var(--nav-highlight)] px-8 py-3.5 text-xs font-medium tracking-[0.18em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
          >
            {dict.home.loadMore}
          </button>
        </div>
      )}
    </>
  );
}
