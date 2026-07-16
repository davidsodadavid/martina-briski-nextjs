"use client";

import { useActionState } from "react";
import type { TestimonialFormState } from "@/app/actions/testimonials";

type TestimonialFormProps = {
  action: (
    state: TestimonialFormState,
    formData: FormData
  ) => Promise<TestimonialFormState>;
  submitLabel: string;
  initialTestimonial?: {
    authorName: string;
    title: string | null;
    description: string;
  };
};

export default function TestimonialForm({
  action,
  submitLabel,
  initialTestimonial,
}: TestimonialFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-md bg-[var(--color-stone)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Author name
        </label>
        <input
          type="text"
          name="authorName"
          required
          defaultValue={initialTestimonial?.authorName}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Title (optional)
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialTestimonial?.title ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={initialTestimonial?.description}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--brand-yellow)] px-5 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
