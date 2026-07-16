"use client";

import { useTransition } from "react";
import { deleteTestimonial } from "@/app/actions/testimonials";

export default function DeleteTestimonialButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    startTransition(() => {
      deleteTestimonial(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
