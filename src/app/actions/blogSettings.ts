"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { BLOG_SETTINGS_ID } from "@/lib/blogSettings";

export type BlogSettingsFormState = { error?: string; success?: boolean };

export async function saveBlogSettings(
  _prevState: BlogSettingsFormState,
  formData: FormData
): Promise<BlogSettingsFormState> {
  await requireAdmin();

  const coverImage = String(formData.get("coverImage") || "").trim();
  const description = String(formData.get("description") || "").trim();

  await prisma.blogSettings.upsert({
    where: { id: BLOG_SETTINGS_ID },
    create: {
      id: BLOG_SETTINGS_ID,
      coverImage: coverImage || null,
      description: description || null,
    },
    update: { coverImage: coverImage || null, description: description || null },
  });

  revalidatePath("/admin/blog-cover");
  revalidatePath("/blog");
  return { success: true };
}
