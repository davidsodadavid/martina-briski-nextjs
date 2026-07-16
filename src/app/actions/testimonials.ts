"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type TestimonialFormState = { error?: string };

function readTestimonialFields(formData: FormData) {
  const authorName = String(formData.get("authorName") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  return { authorName, title, description };
}

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin();

  const { authorName, title, description } = readTestimonialFields(formData);
  if (!authorName || !description) {
    return { error: "Author name and description are required" };
  }

  await prisma.testimonial.create({
    data: { authorName, title: title || null, description },
  });

  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin();

  const { authorName, title, description } = readTestimonialFields(formData);
  if (!authorName || !description) {
    return { error: "Author name and description are required" };
  }

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Testimonial not found" };
  }

  await prisma.testimonial.update({
    where: { id },
    data: { authorName, title: title || null, description },
  });

  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}
