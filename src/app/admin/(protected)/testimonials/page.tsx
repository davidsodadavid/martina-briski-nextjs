import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteTestimonialButton from "@/components/DeleteTestimonialButton";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
        >
          New testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-neutral-200">No testimonials yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{testimonial.authorName}</span>
                {testimonial.title && (
                  <span className="text-xs text-neutral-500">
                    {testimonial.title}
                  </span>
                )}
                <span className="line-clamp-2 text-sm text-neutral-600">
                  {testimonial.description}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/testimonials/${testimonial.id}/edit`}
                  className="text-sm font-medium text-neutral-700 hover:underline"
                >
                  Edit
                </Link>
                <DeleteTestimonialButton id={testimonial.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
