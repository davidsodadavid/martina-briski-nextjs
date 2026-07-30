"use server";

import path from "path";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_PDF_TYPE, MAX_PDF_BYTES, MAX_PDF_MB } from "@/lib/uploads";
import { uploadToR2, listR2Objects } from "@/lib/r2";

export type PdfUploadState = { error?: string; url?: string; filename?: string };

export async function uploadPdf(
  _prevState: PdfUploadState,
  formData: FormData
): Promise<PdfUploadState> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a file" };
  }
  if (file.type !== ALLOWED_PDF_TYPE) {
    return { error: "Only PDF files are allowed" };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { error: `PDF must be smaller than ${MAX_PDF_MB}MB` };
  }

  const ext = path.extname(file.name) || ".pdf";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let url: string;
  try {
    url = await uploadToR2(
      `pdfs/${filename}`,
      buffer,
      "application/pdf",
      `attachment; filename="${encodeURIComponent(file.name)}"`
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload failed" };
  }

  return { url, filename: file.name };
}

export async function listPdfsFromR2() {
  await requireAdmin();
  try {
    return await listR2Objects("pdfs/");
  } catch {
    return [];
  }
}
