import PostForm from "@/components/PostForm";
import { createPost } from "@/app/actions/posts";
import { prisma } from "@/lib/prisma";

export default async function NewPostPage() {
  const [mediaLibrary, categories] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: [{ createdAt: "asc" }, { id: "asc" }] }),
  ]);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">New post</h1>
      <PostForm
        action={createPost}
        submitLabel="Publish"
        mediaLibrary={mediaLibrary}
        categories={categories}
      />
    </>
  );
}
