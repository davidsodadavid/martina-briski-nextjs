"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type ApplyState = { error?: string; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function applyToEvent(
  eventId: string,
  _prevState: ApplyState,
  formData: FormData
): Promise<ApplyState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name) {
    return { error: "Unesite svoje ime" };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Unesite ispravnu email adresu" };
  }
  if (!phone) {
    return { error: "Unesite broj telefona" };
  }
  if (!message) {
    return { error: "Unesite poruku" };
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || !event.published) {
    return { error: "Ovo događanje više nije dostupno" };
  }

  await prisma.eventApplication.create({
    data: {
      eventId,
      name,
      email,
      phone,
      message,
    },
  });

  try {
    await prisma.subscriber.create({ data: { email } });
  } catch {
    // Already subscribed — that's fine.
  }

  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidatePath("/admin/participants");
  revalidatePath("/admin/subscribers");

  return { success: true };
}

export async function deleteEventApplication(id: string) {
  await requireAdmin();
  const application = await prisma.eventApplication.delete({ where: { id } });
  revalidatePath(`/admin/events/${application.eventId}/edit`);
  revalidatePath("/admin/participants");
}
