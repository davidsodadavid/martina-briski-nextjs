import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostType } from "@/generated/prisma/enums";
import PostTypeBadge from "@/components/PostTypeBadge";
import DeletePostButton from "@/components/DeletePostButton";

const FILTERS: { value: PostType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: PostType.OTHER, label: "Other" },
  { value: PostType.ADAPTATION, label: "Adaptation" },
  { value: PostType.PRANAYAMA, label: "Pranayama" },
  { value: PostType.CALMING, label: "Calming practice" },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeType =
    type && Object.values(PostType).includes(type as PostType)
      ? (type as PostType)
      : "ALL";

  const posts = await prisma.post.findMany({
    where: activeType === "ALL" ? {} : { type: activeType },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Blog</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog-cover"
            className="rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Blog settings
          </Link>
          <Link
            href="/admin/posts/new"
            className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
          >
            New post
          </Link>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "ALL" ? "/admin" : `/admin?type=${f.value}`}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              activeType === f.value
                ? "bg-[var(--brand-yellow)] text-[var(--brand-text)]"
                : "bg-[var(--color-stone)] text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-neutral-200">No posts yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <PostTypeBadge type={post.type} />
                  <span className="font-medium">{post.title}</span>
                </div>
                <span className="text-xs text-neutral-400">
                  {post.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-neutral-500 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-sm font-medium text-neutral-700 hover:underline"
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
