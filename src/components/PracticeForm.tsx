"use client";

import { useActionState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { savePractice } from "@/app/actions/practice";
import { PRACTICE_ITEM_COUNT, type PracticeItem } from "@/lib/practice";

type PracticeFormProps = {
  initialPractice: {
    name: string;
    items: PracticeItem[];
  };
};

export default function PracticeForm({ initialPractice }: PracticeFormProps) {
  const [state, formAction, pending] = useActionState(savePractice, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 rounded-md bg-[var(--color-stone)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={initialPractice.name}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: PRACTICE_ITEM_COUNT }, (_, i) => {
          const item = initialPractice.items[i];
          return (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-4"
            >
              <h3 className="text-sm font-semibold text-neutral-800">
                Practice {i + 1}
              </h3>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Title (required)
                </label>
                <input
                  type="text"
                  name={`item-${i}-title`}
                  required
                  defaultValue={item?.title}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Subtitle (optional)
                </label>
                <input
                  type="text"
                  name={`item-${i}-subtitle`}
                  defaultValue={item?.subtitle}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Description
                </label>
                <RichTextEditor
                  name={`item-${i}-description`}
                  initialContent={item?.description}
                />
              </div>
            </div>
          );
        })}
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
