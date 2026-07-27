"use client";

import { useActionState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { saveCv } from "@/app/actions/cv";

export default function CvForm({
  initialTitle,
  initialSubtitle,
  initialDescription,
}: {
  initialTitle: string;
  initialSubtitle: string | null;
  initialDescription: string | null;
}) {
  const [state, formAction, pending] = useActionState(saveCv, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-md bg-[var(--color-stone)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={initialTitle}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Subtitle (optional)
        </label>
        <input
          type="text"
          name="subtitle"
          defaultValue={initialSubtitle ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description
        </label>
        <RichTextEditor name="description" initialContent={initialDescription ?? ""} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm font-medium text-[var(--brand-green)]">
          Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--brand-yellow)] px-5 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
