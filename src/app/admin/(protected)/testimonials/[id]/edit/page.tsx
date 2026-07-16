import { notFound } from "next/navigation";
import TestimonialForm from "@/components/TestimonialForm";
import { prisma } from "@/lib/prisma";
import { updateTestimonial } from "@/app/actions/testimonials";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) {
    notFound();
  }

  const boundUpdateTestimonial = updateTestimonial.bind(null, testimonial.id);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">
        Edit testimonial
      </h1>
      <TestimonialForm
        action={boundUpdateTestimonial}
        submitLabel="Save changes"
        initialTestimonial={testimonial}
      />
    </>
  );
}
