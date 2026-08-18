import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    include: { _count: { select: { posts: true } } },
  });

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin" className="text-sm text-neutral-400 hover:underline">
          ← Blog
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-white">Categories</h1>
      <CategoriesManager
        categories={categories.map((c) => ({
          id: c.id,
          label: c.label,
          postCount: c._count.posts,
        }))}
      />
    </>
  );
}
