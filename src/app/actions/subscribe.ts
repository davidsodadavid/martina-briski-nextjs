"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";

export type SubscribeState = { error?: string; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(email)) {
    const dict = getDictionary(await getLocale());
    return { error: dict.forms.invalidEmail };
  }

  try {
    await prisma.subscriber.create({ data: { email } });
  } catch {
    // Unique constraint (already subscribed) — treat as success so we
    // don't leak which emails are already in the list.
  }

  revalidatePath("/admin/subscribers");
  return { success: true };
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}
