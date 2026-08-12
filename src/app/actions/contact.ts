"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";

export type ContactFormState = { error?: string; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const topic = String(formData.get("topic") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name) {
    return { error: "Unesite svoje ime" };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Unesite ispravnu email adresu" };
  }
  if (!message) {
    return { error: "Unesite poruku" };
  }
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response")))) {
    return { error: "Provjera nije uspjela. Pokušajte ponovno." };
  }

  await prisma.contactMessage.create({
    data: { name, email, topic: topic || "Opće pitanje", message },
  });

  try {
    await prisma.subscriber.create({ data: { email } });
  } catch {
    // Already subscribed — that's fine.
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin/subscribers");

  return { success: true };
}

export async function deleteContactMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
