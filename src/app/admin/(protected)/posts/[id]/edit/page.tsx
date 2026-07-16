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
  const [post, mediaLibrary] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!post) {
    notFound();
  }

  const boundUpdatePost = updatePost.bind(null, post.id);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Edit post</h1>
      <PostForm
        action={boundUpdatePost}
        submitLabel="Save changes"
        initialPost={post}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
