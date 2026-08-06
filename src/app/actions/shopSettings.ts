"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SHOP_SETTINGS_ID } from "@/lib/shopSettings";

export type ShopSettingsFormState = { error?: string; success?: boolean };

export async function saveShopSettings(
  _prevState: ShopSettingsFormState,
  formData: FormData
): Promise<ShopSettingsFormState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  await prisma.shopSettings.upsert({
    where: { id: SHOP_SETTINGS_ID },
    create: {
      id: SHOP_SETTINGS_ID,
      title: title || null,
      description: description || null,
    },
    update: {
      title: title || null,
      description: description || null,
    },
  });

  revalidatePath("/admin/shop/settings");
  revalidatePath("/shop");
  return { success: true };
}
