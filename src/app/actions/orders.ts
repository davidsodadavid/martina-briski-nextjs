"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type OrderFormState = { error?: string; success?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitOrder(
  productId: string,
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const postalCode = String(formData.get("postalCode") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const consent = formData.get("consent") === "on";
  const quantity = Math.max(
    1,
    parseInt(String(formData.get("quantity") || "1"), 10) || 1
  );

  if (!name) {
    return { error: "Unesite svoje ime" };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Unesite ispravnu email adresu" };
  }
  if (!address || !city || !postalCode) {
    return { error: "Unesite adresu za dostavu" };
  }
  if (!consent) {
    return {
      error: "Molimo potvrdi suglasnost za pohranu podataka prije slanja narudžbe",
    };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.published) {
    return { error: "Ovaj proizvod više nije dostupan" };
  }

  await prisma.order.create({
    data: {
      productId,
      productName: product.name,
      price: product.discountPrice ?? product.price,
      quantity,
      name,
      email,
      phone: phone || null,
      address,
      city,
      postalCode,
      country: country || null,
      message: message || null,
    },
  });

  try {
    await prisma.subscriber.create({ data: { email } });
  } catch {
    // Already subscribed — that's fine.
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/subscribers");

  return { success: true };
}

export async function deleteOrder(id: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
}
