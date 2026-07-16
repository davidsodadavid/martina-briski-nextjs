"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type ProductFormState = { error?: string };

async function uniqueSlug(name: string, ignoreId?: string) {
  const base = slugify(name, { lower: true, strict: true }) || "product";
  let slug = base;
  let counter = 1;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

function parseGallery(formData: FormData): string[] {
  const raw = String(formData.get("gallery") || "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "").trim();
  const discountPriceRaw = String(formData.get("discountPrice") || "").trim();
  const gallery = parseGallery(formData);
  return { name, thumbnail, description, priceRaw, discountPriceRaw, gallery };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const { name, thumbnail, description, priceRaw, discountPriceRaw, gallery } =
    readProductFields(formData);

  if (!name) {
    return { error: "Name is required" };
  }

  const price = Number(priceRaw);
  if (!priceRaw || Number.isNaN(price) || price < 0) {
    return { error: "Enter a valid price" };
  }

  let discountPrice: number | null = null;
  if (discountPriceRaw) {
    discountPrice = Number(discountPriceRaw);
    if (Number.isNaN(discountPrice) || discountPrice < 0) {
      return { error: "Enter a valid discount price" };
    }
    if (discountPrice >= price) {
      return { error: "Discount price must be lower than the regular price" };
    }
  }

  const slug = await uniqueSlug(name);

  await prisma.product.create({
    data: {
      name,
      slug,
      thumbnail: thumbnail || null,
      gallery,
      description,
      price,
      discountPrice,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/admin/shop");
  redirect("/admin/shop");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const { name, thumbnail, description, priceRaw, discountPriceRaw, gallery } =
    readProductFields(formData);

  if (!name) {
    return { error: "Name is required" };
  }

  const price = Number(priceRaw);
  if (!priceRaw || Number.isNaN(price) || price < 0) {
    return { error: "Enter a valid price" };
  }

  let discountPrice: number | null = null;
  if (discountPriceRaw) {
    discountPrice = Number(discountPriceRaw);
    if (Number.isNaN(discountPrice) || discountPrice < 0) {
      return { error: "Enter a valid discount price" };
    }
    if (discountPrice >= price) {
      return { error: "Discount price must be lower than the regular price" };
    }
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Product not found" };
  }

  const slug =
    existing.name === name ? existing.slug : await uniqueSlug(name, id);

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      thumbnail: thumbnail || null,
      gallery,
      description,
      price,
      discountPrice,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/admin/shop");
  revalidatePath(`/shop/${slug}`);
  redirect("/admin/shop");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const product = await prisma.product.delete({ where: { id } });
  revalidatePath("/shop");
  revalidatePath("/admin/shop");
  revalidatePath(`/shop/${product.slug}`);
}
