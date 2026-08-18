"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CONTACT_SETTINGS_ID } from "@/lib/contactSettings";

export type ContactSettingsFormState = { error?: string; success?: boolean };

export async function saveContactSettings(
  _prevState: ContactSettingsFormState,
  formData: FormData
): Promise<ContactSettingsFormState> {
  await requireAdmin();

  const heroPhoto = String(formData.get("heroPhoto") || "").trim();
  const label = String(formData.get("label") || "").trim();
  const heading = String(formData.get("heading") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const mapAddress = String(formData.get("mapAddress") || "").trim();

  const data = {
    heroPhoto: heroPhoto || null,
    label: label || null,
    heading: heading || null,
    text: text || null,
    note: note || null,
    email: email || null,
    mapAddress: mapAddress || null,
  };

  await prisma.contactSettings.upsert({
    where: { id: CONTACT_SETTINGS_ID },
    create: { id: CONTACT_SETTINGS_ID, ...data },
    update: data,
  });

  revalidatePath("/admin/contact");
  revalidatePath("/contact");
  return { success: true };
}
