"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getLocale, getDictionary } from "@/lib/i18n";
import { addMailerliteSubscriber } from "@/lib/mailerlite";
import { verifyTurnstile } from "@/lib/turnstile";

export type SubscribeState = { error?: string; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const dict = getDictionary(await getLocale());

  if (!firstName || !lastName) {
    return { error: dict.forms.nameRequired };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: dict.forms.invalidEmail };
  }
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response")))) {
    return { error: dict.forms.botCheckFailed };
  }

  try {
    await prisma.subscriber.create({ data: { firstName, lastName, email } });
  } catch {
    // Unique constraint (already subscribed) — update the name in case it
    // was missing/different, and treat as success so we don't leak which
    // emails are already in the list.
    await prisma.subscriber
      .update({ where: { email }, data: { firstName, lastName } })
      .catch(() => {});
  }

  await addMailerliteSubscriber(email, { firstName, lastName });

  revalidatePath("/admin/subscribers");
  return { success: true };
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}
