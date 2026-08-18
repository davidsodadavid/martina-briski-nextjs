"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type EventFormState = { error?: string };

async function uniqueSlug(title: string, ignoreId?: string) {
  const base = slugify(title, { lower: true, strict: true }) || "event";
  let slug = base;
  let counter = 1;
  while (
    await prisma.event.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

function readEventFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const thumbnail = String(formData.get("thumbnail") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const endTime = String(formData.get("endTime") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = String(formData.get("price") || "").trim();
  return { title, thumbnail, date, endTime, location, description, price };
}

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();

  const { title, thumbnail, date, endTime, location, description, price } =
    readEventFields(formData);
  if (!title || !date) {
    return { error: "Title and date are required" };
  }
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: "Invalid date" };
  }
  const parsedEndTime = endTime ? new Date(endTime) : null;
  if (parsedEndTime && Number.isNaN(parsedEndTime.getTime())) {
    return { error: "Invalid end date" };
  }

  const slug = await uniqueSlug(title);

  await prisma.event.create({
    data: {
      title,
      slug,
      thumbnail: thumbnail || null,
      date: parsedDate,
      endTime: parsedEndTime,
      location: location || null,
      description,
      price: price || null,
    },
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEvent(
  id: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();

  const { title, thumbnail, date, endTime, location, description, price } =
    readEventFields(formData);
  if (!title || !date) {
    return { error: "Title and date are required" };
  }
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: "Invalid date" };
  }
  const parsedEndTime = endTime ? new Date(endTime) : null;
  if (parsedEndTime && Number.isNaN(parsedEndTime.getTime())) {
    return { error: "Invalid end date" };
  }

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Event not found" };
  }

  const slug =
    existing.title === title ? existing.slug : await uniqueSlug(title, id);

  await prisma.event.update({
    where: { id },
    data: {
      title,
      slug,
      thumbnail: thumbnail || null,
      date: parsedDate,
      endTime: parsedEndTime,
      location: location || null,
      description,
      price: price || null,
    },
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath(`/events/${slug}`);
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const event = await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath(`/events/${event.slug}`);
}

export async function toggleEventPublished(id: string) {
  await requireAdmin();
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return;

  const updated = await prisma.event.update({
    where: { id },
    data: { published: !event.published },
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath(`/events/${updated.slug}`);
}
