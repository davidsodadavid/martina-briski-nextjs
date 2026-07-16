"use client";

import { useActionState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import type { EventFormState } from "@/app/actions/events";
import { toDatetimeLocalValue } from "@/lib/eventTime";

type MediaItem = { id: string; url: string; filename: string };

type EventFormProps = {
  action: (
    state: EventFormState,
    formData: FormData
  ) => Promise<EventFormState>;
  submitLabel: string;
  initialEvent?: {
    title: string;
    thumbnail: string | null;
    date: Date;
    endTime: Date | null;
    location: string | null;
    description: string;
    price: string | null;
  };
  mediaLibrary: MediaItem[];
};

export default function EventForm({
  action,
  submitLabel,
  initialEvent,
  mediaLibrary,
}: EventFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

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
          defaultValue={initialEvent?.title}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Thumbnail
        </label>
        <ThumbnailPicker
          name="thumbnail"
          initialUrl={initialEvent?.thumbnail}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Start date &amp; time
          </label>
          <input
            type="datetime-local"
            name="date"
            required
            defaultValue={
              initialEvent
                ? toDatetimeLocalValue(initialEvent.date)
                : undefined
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            End date &amp; time (optional)
          </label>
          <input
            type="datetime-local"
            name="endTime"
            defaultValue={
              initialEvent?.endTime
                ? toDatetimeLocalValue(initialEvent.endTime)
                : undefined
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Location (optional)
          </label>
          <input
            type="text"
            name="location"
            defaultValue={initialEvent?.location ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Price (optional)
          </label>
          <input
            type="text"
            name="price"
            placeholder="e.g. 15 €"
            defaultValue={initialEvent?.price ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description
        </label>
        <RichTextEditor
          name="description"
          initialContent={initialEvent?.description}
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
