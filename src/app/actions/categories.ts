"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type CategoryFormState = { error?: string; success?: boolean };

function revalidateAll() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const label = String(formData.get("label") || "").trim();
  if (!label) {
    return { error: "Naziv kategorije je obavezan" };
  }

  await prisma.category.create({ data: { label } });
  revalidateAll();
  return { success: true };
}

export async function renameCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const label = String(formData.get("label") || "").trim();
  if (!label) {
    return { error: "Naziv kategorije je obavezan" };
  }

  await prisma.category.update({ where: { id }, data: { label } });
  revalidateAll();
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidateAll();
}
