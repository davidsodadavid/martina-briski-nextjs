"use client";

import { useActionState } from "react";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import PdfPicker from "@/components/PdfPicker";
import { saveAbout } from "@/app/actions/about";
import { ABOUT_STEP_COUNT, type AboutStep } from "@/lib/about";

type MediaItem = { id: string; url: string; filename: string; alt: string | null };
type PdfItem = { key: string; url: string; filename: string };

type AboutFormProps = {
  initialAbout: {
    name: string;
    thumbnail: string | null;
    steps: AboutStep[];
    pdfUrl: string | null;
    pdfFilename: string | null;
  };
  mediaLibrary: MediaItem[];
  pdfLibrary: PdfItem[];
};

export default function AboutForm({
  initialAbout,
  mediaLibrary,
  pdfLibrary,
}: AboutFormProps) {
  const [state, formAction, pending] = useActionState(saveAbout, {});

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
          defaultValue={initialAbout.name}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Thumbnail (optional)
        </label>
        <ThumbnailPicker
          name="thumbnail"
          initialUrl={initialAbout.thumbnail}
          mediaLibrary={mediaLibrary}
          allowUpload={false}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          PDF (optional)
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Linked from the public about page as &quot;Pročitaj više&quot; —
          near the top and again as a section near the bottom.
        </p>
        <PdfPicker
          urlFieldName="pdfUrl"
          filenameFieldName="pdfFilename"
          initialUrl={initialAbout.pdfUrl}
          initialFilename={initialAbout.pdfFilename}
          pdfLibrary={pdfLibrary}
        />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: ABOUT_STEP_COUNT }, (_, i) => {
          const step = initialAbout.steps[i];
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
