import PostForm from "@/components/PostForm";
import { createPost } from "@/app/actions/posts";
import { prisma } from "@/lib/prisma";

export default async function NewPostPage() {
  const mediaLibrary = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">New post</h1>
      <PostForm
        action={createPost}
        submitLabel="Publish"
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
