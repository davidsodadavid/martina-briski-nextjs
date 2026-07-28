"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { FREE_CONTENT_SETTINGS_ID } from "@/lib/freeContentSettings";

export type FreeContentSettingsFormState = { error?: string; success?: boolean };

export async function saveFreeContentSettings(
  _prevState: FreeContentSettingsFormState,
  formData: FormData
): Promise<FreeContentSettingsFormState> {
  await requireAdmin();

  const coverImage = String(formData.get("coverImage") || "").trim();
  const description = String(formData.get("description") || "").trim();

  await prisma.freeContentSettings.upsert({
    where: { id: FREE_CONTENT_SETTINGS_ID },
    create: {
      id: FREE_CONTENT_SETTINGS_ID,
      coverImage: coverImage || null,
      description: description || null,
    },
    update: { coverImage: coverImage || null, description: description || null },
  });

  revalidatePath("/admin/free-content-cover");
  revalidatePath("/free-content");
  return { success: true };
}
