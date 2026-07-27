"use client";

import { useActionState } from "react";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import { saveBlogSettings } from "@/app/actions/blogSettings";

type MediaItem = { id: string; url: string; filename: string };

export default function BlogSettingsForm({
  initialCoverImage,
  initialDescription,
  mediaLibrary,
}: {
  initialCoverImage: string | null;
  initialDescription: string | null;
  mediaLibrary: MediaItem[];
}) {
  const [state, formAction, pending] = useActionState(saveBlogSettings, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 rounded-md bg-[var(--color-stone)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Cover photo (optional)
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Shown full-width at the top of the public blog page. Remove it to
          fall back to the plain text header.
        </p>
        <ThumbnailPicker
          name="coverImage"
          initialUrl={initialCoverImage}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description (optional)
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Shown under the title on the public blog page, below the cover
          photo (or below the title if there&apos;s no cover photo).
        </p>
        <textarea
          name="description"
          rows={5}
          defaultValue={initialDescription ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
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
