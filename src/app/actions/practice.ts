"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PRACTICE_ID, PRACTICE_ITEM_COUNT, type PracticeItem } from "@/lib/practice";

export type PracticeFormState = { error?: string; success?: boolean };

function readItems(formData: FormData): PracticeItem[] {
  return Array.from({ length: PRACTICE_ITEM_COUNT }, (_, i) => ({
    title: String(formData.get(`item-${i}-title`) || "").trim(),
    subtitle: String(formData.get(`item-${i}-subtitle`) || "").trim(),
    description: String(formData.get(`item-${i}-description`) || "").trim(),
  }));
}

export async function savePractice(
  _prevState: PracticeFormState,
  formData: FormData
): Promise<PracticeFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { error: "Name is required" };
  }

  const items = readItems(formData);
  if (items.some((i) => !i.title)) {
    return { error: "Every practice needs a title" };
  }

  await prisma.practice.upsert({
    where: { id: PRACTICE_ID },
    create: { id: PRACTICE_ID, name, items },
    update: { name, items },
  });

  revalidatePath("/admin/practice");
  revalidatePath("/practice");
  return { success: true };
}
