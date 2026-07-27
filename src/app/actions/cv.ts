"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CV_ID } from "@/lib/cv";

export type CvFormState = { error?: string; success?: boolean };

export async function saveCv(
  _prevState: CvFormState,
  formData: FormData
): Promise<CvFormState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) {
    return { error: "Title is required" };
  }
  const subtitle = String(formData.get("subtitle") || "").trim();
  const description = String(formData.get("description") || "").trim();

  await prisma.cv.upsert({
    where: { id: CV_ID },
    create: {
      id: CV_ID,
      title,
      subtitle: subtitle || null,
      description: description || null,
    },
    update: {
      title,
      subtitle: subtitle || null,
      description: description || null,
    },
  });

  revalidatePath("/admin/cv");
  revalidatePath("/cv");
  return { success: true };
}
