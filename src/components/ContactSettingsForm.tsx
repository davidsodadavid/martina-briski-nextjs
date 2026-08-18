"use client";

import { useActionState } from "react";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import { saveContactSettings } from "@/app/actions/contactSettings";

type MediaItem = { id: string; url: string; filename: string; alt: string | null };

export default function ContactSettingsForm({
  initialHeroPhoto,
  initialLabel,
  initialHeading,
  initialText,
  initialNote,
  initialEmail,
  initialMapAddress,
  mediaLibrary,
}: {
  initialHeroPhoto: string | null;
  initialLabel: string | null;
  initialHeading: string | null;
  initialText: string | null;
  initialNote: string | null;
  initialEmail: string | null;
  initialMapAddress: string | null;
  mediaLibrary: MediaItem[];
}) {
  const [state, formAction, pending] = useActionState(
    saveContactSettings,
    {},
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 rounded-md bg-[var(--color-stone)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Hero label
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Small bracketed label shown over the top-left of the hero photo,
          e.g. &quot;Kontakt&quot;.
        </p>
        <input
          type="text"
          name="label"
          defaultValue={initialLabel ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Hero photo
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Full-bleed photo behind the page header.
        </p>
        <ThumbnailPicker
          name="heroPhoto"
          initialUrl={initialHeroPhoto}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Heading
        </label>
        <input
          type="text"
          name="heading"
          defaultValue={initialHeading ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Intro text
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Shown under the heading, above the form. The email address below is
          appended to the end of it automatically as a link.
        </p>
        <textarea
          name="text"
          rows={4}
          defaultValue={initialText ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Secondary note
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Shown under the intro text, e.g. expected reply time.
        </p>
        <textarea
          name="note"
          rows={3}
          defaultValue={initialNote ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Contact email
        </label>
        <input
          type="email"
          name="email"
          defaultValue={initialEmail ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Map address
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Used to look up the location shown on the embedded map, e.g.
          &quot;Ilica 42, Zagreb&quot;.
        </p>
        <input
          type="text"
          name="mapAddress"
          defaultValue={initialMapAddress ?? ""}
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
