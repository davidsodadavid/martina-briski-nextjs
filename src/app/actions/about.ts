"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ABOUT_ID, ABOUT_STEP_COUNT, type AboutStep } from "@/lib/about";

export type AboutFormState = { error?: string; success?: boolean };

function readSteps(formData: FormData): AboutStep[] {
  return Array.from({ length: ABOUT_STEP_COUNT }, (_, i) => ({
    title: String(formData.get(`step-${i}-title`) || "").trim(),
    subtitle: String(formData.get(`step-${i}-subtitle`) || "").trim(),
    description: String(formData.get(`step-${i}-description`) || "").trim(),
    image: String(formData.get(`step-${i}-image`) || "").trim(),
  }));
}

export async function saveAbout(
  _prevState: AboutFormState,
  formData: FormData
): Promise<AboutFormState> {
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

  await prisma.about.upsert({
    where: { id: ABOUT_ID },
    create: { id: ABOUT_ID, name, thumbnail: thumbnail || null, steps },
    update: { name, thumbnail: thumbnail || null, steps },
  });

  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { success: true };
}
