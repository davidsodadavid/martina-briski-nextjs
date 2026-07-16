"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PostType } from "@/generated/prisma/enums";

export type PostFormState = { error?: string };

async function uniqueSlug(title: string, ignoreId?: string) {
  const base = slugify(title, { lower: true, strict: true }) || "post";
  let slug = base;
  let counter = 1;
  while (
    await prisma.post.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

function readPostFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const type = String(formData.get("type") || "NEWS") as PostType;
  return { title, thumbnail, content, type };
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await requireAdmin();

  const { title, thumbnail, content, type } = readPostFields(formData);
  if (!title || !content) {
    return { error: "Title and content are required" };
  }
  if (!Object.values(PostType).includes(type)) {
    return { error: "Invalid post type" };
  }

  const slug = await uniqueSlug(title);

  await prisma.post.create({
    data: { title, slug, thumbnail: thumbnail || null, content, type },
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

  const { title, thumbnail, content, type } = readPostFields(formData);
  if (!title || !content) {
    return { error: "Title and content are required" };
  }
  if (!Object.values(PostType).includes(type)) {
    return { error: "Invalid post type" };
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Post not found" };
  }

  const slug =
    existing.title === title ? existing.slug : await uniqueSlug(title, id);

  await prisma.post.update({
    where: { id },
    data: { title, slug, thumbnail: thumbnail || null, content, type },
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
