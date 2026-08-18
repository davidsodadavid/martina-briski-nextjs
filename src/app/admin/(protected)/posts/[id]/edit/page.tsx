import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/PostForm";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/app/actions/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, mediaLibrary, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: [{ createdAt: "asc" }, { id: "asc" }] }),
  ]);

  if (!post) {
    notFound();
  }

  const boundUpdatePost = updatePost.bind(null, post.id);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Edit post</h1>
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          View post
        </Link>
      </div>
      <PostForm
        action={boundUpdatePost}
        submitLabel="Save changes"
        initialPost={post}
        mediaLibrary={mediaLibrary}
        categories={categories}
      />
    </>
  );
}
