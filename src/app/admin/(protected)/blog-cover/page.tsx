import Link from "next/link";
import BlogCoverForm from "@/components/BlogCoverForm";
import { prisma } from "@/lib/prisma";
import { BLOG_SETTINGS_ID } from "@/lib/blogSettings";

export default async function AdminBlogCoverPage() {
  const [settings, mediaLibrary] = await Promise.all([
    prisma.blogSettings.findUnique({ where: { id: BLOG_SETTINGS_ID } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin" className="text-sm text-neutral-400 hover:underline">
          ← Blog
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-white">
        Blog cover photo
      </h1>
      <BlogCoverForm
        initialCoverImage={settings?.coverImage ?? null}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
