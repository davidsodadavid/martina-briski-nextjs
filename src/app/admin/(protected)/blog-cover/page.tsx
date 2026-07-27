import Link from "next/link";
import BlogSettingsForm from "@/components/BlogSettingsForm";
import { prisma } from "@/lib/prisma";
import { BLOG_SETTINGS_ID } from "@/lib/blogSettings";

export default async function AdminBlogSettingsPage() {
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
        Blog settings
      </h1>
      <BlogSettingsForm
        initialCoverImage={settings?.coverImage ?? null}
        initialDescription={settings?.description ?? null}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
