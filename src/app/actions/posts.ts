"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type PostFormState = { error?: string };

async function uniqueSlug(base: string, ignoreId?: string) {
  const normalized = slugify(base, { lower: true, strict: true }) || "post";
  let slug = normalized;
  let counter = 1;
  while (
    await prisma.post.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    slug = `${normalized}-${counter++}`;
  }
  return slug;
}

function readPostFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const metaDescription = String(formData.get("metaDescription") || "").trim();
  return { title, slug, thumbnail, content, categoryId, metaDescription };
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await requireAdmin();

  const { title, slug: customSlug, thumbnail, content, categoryId, metaDescription } =
    readPostFields(formData);
  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const slug = await uniqueSlug(customSlug || title);

  await prisma.post.create({
    data: {
      title,
      slug,
      thumbnail: thumbnail || null,
      content,
      categoryId: categoryId || null,
      metaDescription: metaDescription || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await requireAdmin();

  const { title, slug: customSlug, thumbnail, content, categoryId, metaDescription } =
    readPostFields(formData);
  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Post not found" };
  }

  const slug = await uniqueSlug(customSlug || title, id);

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      thumbnail: thumbnail || null,
      content,
      categoryId: categoryId || null,
      metaDescription: metaDescription || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const post = await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/blog/${post.slug}`);
}

export async function togglePostPublished(id: string) {
  await requireAdmin();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return;

  const updated = await prisma.post.update({
    where: { id },
    data: { published: !post.published },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/blog/${updated.slug}`);
}
