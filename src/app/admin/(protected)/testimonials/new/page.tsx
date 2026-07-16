import TestimonialForm from "@/components/TestimonialForm";
import { createTestimonial } from "@/app/actions/testimonials";

export default function NewTestimonialPage() {
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">
        New testimonial
      </h1>
      <TestimonialForm action={createTestimonial} submitLabel="Publish" />
    </>
  );
}
