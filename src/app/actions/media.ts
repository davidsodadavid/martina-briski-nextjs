"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/uploads";
import { uploadToR2, deleteFromR2, listR2Objects } from "@/lib/r2";

export type UploadState = { error?: string; url?: string; id?: string };

export async function uploadMedia(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a file" };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Only PNG, JPEG, WEBP, or GIF images are allowed" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: `Image must be smaller than ${MAX_UPLOAD_MB}MB` };
  }

  const ext = path.extname(file.name).toLowerCase() || "";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let url: string;
  try {
    url = await uploadToR2(`media/${filename}`, buffer, file.type);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }

  const media = await prisma.media.create({
    data: { url, filename: file.name },
  });

  revalidatePath("/admin/media");
  revalidatePath("/admin/posts/new");
  return { url, id: media.id };
}

export async function updateMediaAlt(id: string, alt: string) {
  await requireAdmin();
  await prisma.media.update({
    where: { id },
    data: { alt: alt.trim() || null },
  });
  revalidatePath("/admin/media");
}

export type SyncState = { error?: string; added?: number };

export async function syncMediaFromR2(
  _prevState: SyncState,
  _formData: FormData
): Promise<SyncState> {
  await requireAdmin();

  let objects;
  try {
    objects = await listR2Objects("media/");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not list bucket" };
  }

  const existing = await prisma.media.findMany({ select: { url: true } });
  const existingUrls = new Set(existing.map((m) => m.url));

  const missing = objects.filter((obj) => !existingUrls.has(obj.url));

  if (missing.length > 0) {
    await prisma.media.createMany({
      data: missing.map((obj) => ({ url: obj.url, filename: obj.filename })),
    });
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/posts/new");
  return { added: missing.length };
}

export async function deleteMedia(id: string) {
  await requireAdmin();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  await prisma.media.delete({ where: { id } });
  await deleteFromR2(media.url);

  revalidatePath("/admin/media");
}
