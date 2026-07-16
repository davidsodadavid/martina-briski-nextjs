"use client";

import { useActionState, useRef, useState } from "react";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import type { EbookFormState } from "@/app/actions/ebooks";

type MediaItem = { id: string; url: string; filename: string };

type EbookFormProps = {
  action: (
    state: EbookFormState,
    formData: FormData
  ) => Promise<EbookFormState>;
  submitLabel: string;
  initialEbook?: {
    title: string;
    thumbnail: string | null;
    description: string | null;
    pdfFilename: string;
  };
  mediaLibrary: MediaItem[];
};

export default function EbookForm({
  action,
  submitLabel,
  initialEbook,
  mediaLibrary,
}: EbookFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(
    initialEbook?.pdfFilename ?? null
  );

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
          defaultValue={initialEbook?.title}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Thumbnail
        </label>
        <ThumbnailPicker
          name="thumbnail"
          initialUrl={initialEbook?.thumbnail}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description (optional)
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialEbook?.description ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          PDF file
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={(e) =>
            setFileName(
              e.target.files?.[0]?.name ?? initialEbook?.pdfFilename ?? null
            )
          }
          className="hidden"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-[var(--brand-yellow)] px-3 py-1.5 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
          >
            {initialEbook ? "Replace PDF" : "Choose PDF"}
          </button>
          {fileName && (
            <span className="text-sm text-neutral-600">{fileName}</span>
          )}
        </div>
        {initialEbook && (
          <p className="mt-1 text-xs text-neutral-500">
            Leave empty to keep the current PDF.
          </p>
        )}
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
