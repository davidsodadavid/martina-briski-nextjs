"use client";

import { useActionState, useRef, useState } from "react";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import GalleryPicker from "@/components/GalleryPicker";
import type { ProgramFormState } from "@/app/actions/programs";
import { PROGRAM_STEP_COUNT, type ProgramStep } from "@/lib/program";

type MediaItem = { id: string; url: string; filename: string };

type ProgramFormProps = {
  action: (
    state: ProgramFormState,
    formData: FormData
  ) => Promise<ProgramFormState>;
  submitLabel: string;
  initialProgram?: {
    name: string;
    thumbnail: string | null;
    description: string | null;
    tags: string[];
    galleryImages: string[];
    pdfFilename: string | null;
    steps: ProgramStep[];
  };
  mediaLibrary: MediaItem[];
};

export default function ProgramForm({
  action,
  submitLabel,
  initialProgram,
  mediaLibrary,
}: ProgramFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(
    initialProgram?.pdfFilename ?? null
  );

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
          defaultValue={initialProgram?.name}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Thumbnail / hero photo (optional)
        </label>
        <ThumbnailPicker
          name="thumbnail"
          initialUrl={initialProgram?.thumbnail}
          mediaLibrary={mediaLibrary}
          allowUpload={false}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description (optional)
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialProgram?.description ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Shown as the intro paragraph on the program page.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Tags (optional)
        </label>
        <input
          type="text"
          name="tags"
          placeholder="grupni sat, studio, srednja razina"
          defaultValue={initialProgram?.tags.join(", ") ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-neutral-500">Comma-separated.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Gallery photos (optional)
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Shown as a full-width auto-advancing slideshow on the program page.
          Add two or more to make it slide; a single photo just displays
          statically.
        </p>
        <GalleryPicker
          name="galleryImages"
          initialUrls={initialProgram?.galleryImages ?? []}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Program guide PDF (optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={(e) =>
            setFileName(
              e.target.files?.[0]?.name ?? initialProgram?.pdfFilename ?? null
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
            {initialProgram?.pdfFilename ? "Replace PDF" : "Choose PDF"}
          </button>
          {fileName && (
            <span className="text-sm text-neutral-600">{fileName}</span>
          )}
        </div>
        {initialProgram?.pdfFilename && (
          <p className="mt-1 text-xs text-neutral-500">
            Leave empty to keep the current PDF.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: PROGRAM_STEP_COUNT }, (_, i) => {
          const step = initialProgram?.steps[i];
          return (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-4"
            >
              <h3 className="text-sm font-semibold text-neutral-800">
                Step {i + 1}
              </h3>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Title (required)
                </label>
                <input
                  type="text"
                  name={`step-${i}-title`}
                  required
                  defaultValue={step?.title}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Subtitle (optional)
                </label>
                <input
                  type="text"
                  name={`step-${i}-subtitle`}
                  defaultValue={step?.subtitle}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Description (optional)
                </label>
                <textarea
                  name={`step-${i}-description`}
                  rows={3}
                  defaultValue={step?.description}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Image (optional)
                </label>
                <ThumbnailPicker
                  name={`step-${i}-image`}
                  initialUrl={step?.image}
                  mediaLibrary={mediaLibrary}
                  allowUpload={false}
                />
              </div>
            </div>
          );
        })}
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
