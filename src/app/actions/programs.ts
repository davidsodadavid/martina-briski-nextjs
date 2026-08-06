"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PROGRAM_STEP_COUNT, type ProgramStep } from "@/lib/program";
import { ALLOWED_PDF_TYPE, MAX_PDF_BYTES, MAX_PDF_MB } from "@/lib/uploads";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

export type ProgramFormState = { error?: string };

async function uniqueSlug(name: string, ignoreId?: string) {
  const base = slugify(name, { lower: true, strict: true }) || "program";
  let slug = base;
  let counter = 1;
  while (
    await prisma.program.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

function readSteps(formData: FormData): ProgramStep[] {
  return Array.from({ length: PROGRAM_STEP_COUNT }, (_, i) => ({
    title: String(formData.get(`step-${i}-title`) || "").trim(),
    subtitle: String(formData.get(`step-${i}-subtitle`) || "").trim(),
    description: String(formData.get(`step-${i}-description`) || "").trim(),
    image: String(formData.get(`step-${i}-image`) || "").trim(),
  }));
}

function readTags(formData: FormData): string[] {
  const raw = String(formData.get("tags") || "");
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function readGalleryImages(formData: FormData): string[] {
  const raw = String(formData.get("galleryImages") || "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
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

export async function createProgram(
  _prevState: ProgramFormState,
  formData: FormData
): Promise<ProgramFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { error: "Name is required" };
  }

  const steps = readSteps(formData);
  if (steps.some((s) => !s.title)) {
    return { error: "Every step needs a title" };
  }

  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const tags = readTags(formData);
  const galleryImages = readGalleryImages(formData);

  let pdfUrl: string | null = null;
  let pdfFilename: string | null = null;
  const file = formData.get("pdf");
  if (file instanceof File && file.size > 0) {
    if (file.type !== ALLOWED_PDF_TYPE) {
      return { error: "Only PDF files are allowed" };
    }
    if (file.size > MAX_PDF_BYTES) {
      return { error: `PDF must be smaller than ${MAX_PDF_MB}MB` };
    }
    pdfUrl = await savePdfFile(file);
    pdfFilename = file.name;
  }

  const slug = await uniqueSlug(name);

  await prisma.program.create({
    data: {
      name,
      slug,
      thumbnail: thumbnail || null,
      description: description || null,
      tags,
      galleryImages,
      pdfUrl,
      pdfFilename,
      steps,
    },
  });

  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function updateProgram(
  id: string,
  _prevState: ProgramFormState,
  formData: FormData
): Promise<ProgramFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { error: "Name is required" };
  }

  const steps = readSteps(formData);
  if (steps.some((s) => !s.title)) {
    return { error: "Every step needs a title" };
  }

  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const tags = readTags(formData);
  const galleryImages = readGalleryImages(formData);

  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Program not found" };
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
    if (existing.pdfUrl) await deleteFromR2(existing.pdfUrl);
    pdfUrl = newPdfUrl;
    pdfFilename = file.name;
  }

  const slug =
    existing.name === name ? existing.slug : await uniqueSlug(name, id);

  await prisma.program.update({
    where: { id },
    data: {
      name,
      slug,
      thumbnail: thumbnail || null,
      description: description || null,
      tags,
      galleryImages,
      pdfUrl,
      pdfFilename,
      steps,
    },
  });

  revalidatePath("/admin/programs");
  revalidatePath(`/programs/${slug}`);
  redirect("/admin/programs");
}

export async function deleteProgram(id: string) {
  await requireAdmin();
  const program = await prisma.program.delete({ where: { id } });
  if (program.pdfUrl) await deleteFromR2(program.pdfUrl);
  revalidatePath("/admin/programs");
  revalidatePath(`/programs/${program.slug}`);
}
