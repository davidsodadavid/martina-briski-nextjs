"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_PDF_TYPE, MAX_PDF_BYTES, MAX_PDF_MB } from "@/lib/uploads";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

export type EbookFormState = { error?: string };

async function uniqueSlug(title: string, ignoreId?: string) {
  const base = slugify(title, { lower: true, strict: true }) || "ebook";
  let slug = base;
  let counter = 1;
  while (
    await prisma.ebook.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

async function savePdfFile(file: File) {
  const ext = path.extname(file.name) || ".pdf";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadToR2(
    `pdfs/${filename}`,
    buffer,
    "application/pdf",
    `attachment; filename="${encodeURIComponent(file.name)}"`
  );
}

export async function createEbook(
  _prevState: EbookFormState,
  formData: FormData
): Promise<EbookFormState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) {
    return { error: "Title is required" };
  }

  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const longDescription = String(formData.get("longDescription") || "").trim();

  const file = formData.get("pdf");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a PDF file" };
  }
  if (file.type !== ALLOWED_PDF_TYPE) {
    return { error: "Only PDF files are allowed" };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { error: `PDF must be smaller than ${MAX_PDF_MB}MB` };
  }

  const pdfUrl = await savePdfFile(file);
  const slug = await uniqueSlug(title);

  await prisma.ebook.create({
    data: {
      title,
      slug,
      thumbnail: thumbnail || null,
      description: description || null,
      longDescription: longDescription || null,
      pdfUrl,
      pdfFilename: file.name,
    },
  });

  revalidatePath("/free-content");
  revalidatePath("/admin/ebooks");
  redirect("/admin/ebooks");
}

export async function updateEbook(
  id: string,
  _prevState: EbookFormState,
  formData: FormData
): Promise<EbookFormState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) {
    return { error: "Title is required" };
  }

  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const longDescription = String(formData.get("longDescription") || "").trim();

  const existing = await prisma.ebook.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Book not found" };
  }

  let pdfUrl = existing.pdfUrl;
  let pdfFilename = existing.pdfFilename;

  const file = formData.get("pdf");
  if (file instanceof File && file.size > 0) {
    if (file.type !== ALLOWED_PDF_TYPE) {
      return { error: "Only PDF files are allowed" };
    }
    if (file.size > MAX_PDF_BYTES) {
      return { error: `PDF must be smaller than ${MAX_PDF_MB}MB` };
    }
    const newPdfUrl = await savePdfFile(file);
    await deleteFromR2(existing.pdfUrl);
    pdfUrl = newPdfUrl;
    pdfFilename = file.name;
  }

  const slug =
    existing.title === title ? existing.slug : await uniqueSlug(title, id);

  await prisma.ebook.update({
    where: { id },
    data: {
      title,
      slug,
      thumbnail: thumbnail || null,
      description: description || null,
      longDescription: longDescription || null,
      pdfUrl,
      pdfFilename,
    },
  });

  revalidatePath("/free-content");
  revalidatePath(`/free-content/${slug}`);
  revalidatePath("/admin/ebooks");
  redirect("/admin/ebooks");
}

export async function deleteEbook(id: string) {
  await requireAdmin();
  const ebook = await prisma.ebook.delete({ where: { id } });
  await deleteFromR2(ebook.pdfUrl);
  revalidatePath("/free-content");
  revalidatePath("/admin/ebooks");
}
