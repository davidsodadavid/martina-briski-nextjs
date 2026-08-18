import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeletePostButton from "@/components/DeletePostButton";
import PublishToggle from "@/components/PublishToggle";
import { togglePostPublished } from "@/app/actions/posts";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  const activeCategory =
    category && categories.some((c) => c.id === category) ? category : "ALL";

  const posts = await prisma.post.findMany({
    where: activeCategory === "ALL" ? {} : { categoryId: activeCategory },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Blog</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Categories
          </Link>
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

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            activeCategory === "ALL"
              ? "bg-[var(--brand-yellow)] text-[var(--brand-text)]"
              : "bg-[var(--color-stone)] text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin?category=${c.id}`}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              activeCategory === c.id
                ? "bg-[var(--brand-yellow)] text-[var(--brand-text)]"
                : "bg-[var(--color-stone)] text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {c.label}
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
                  <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                    {post.category?.label ?? "Ostalo"}
                  </span>
                  <span className="font-medium">{post.title}</span>
                </div>
                <span className="text-xs text-neutral-400">
                  {post.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <PublishToggle
                  published={post.published}
                  onToggle={togglePostPublished.bind(null, post.id)}
                />
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
