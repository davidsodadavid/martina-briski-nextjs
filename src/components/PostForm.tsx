"use client";

import { useActionState, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import type { PostFormState } from "@/app/actions/posts";
import { PostType } from "@/generated/prisma/enums";

const META_DESCRIPTION_MAX = 160;

type MediaItem = { id: string; url: string; filename: string };

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: PostType.OTHER, label: "Other" },
  { value: PostType.ADAPTATION, label: "Adaptation" },
  { value: PostType.PRANAYAMA, label: "Pranayama" },
  { value: PostType.CALMING, label: "Calming practice" },
];

type PostFormProps = {
  action: (
    state: PostFormState,
    formData: FormData
  ) => Promise<PostFormState>;
  submitLabel: string;
  initialPost?: {
    title: string;
    slug: string;
    thumbnail: string | null;
    content: string;
    type: PostType;
    metaDescription: string | null;
  };
  mediaLibrary: MediaItem[];
};

export default function PostForm({
  action,
  submitLabel,
  initialPost,
  mediaLibrary,
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [metaDescription, setMetaDescription] = useState(
    initialPost?.metaDescription ?? ""
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
          defaultValue={initialPost?.title}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          URL slug (optional)
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          The post&apos;s URL is /blog/&lt;slug&gt;. Leave blank to
          auto-generate from the title.
        </p>
        <input
          type="text"
          name="slug"
          defaultValue={initialPost?.slug}
          placeholder="npr. kako-ostati-dosljedan-u-praksi"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Meta description (optional)
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Shown in Google search results and social previews. Aim for under{" "}
          {META_DESCRIPTION_MAX} characters.
        </p>
        <textarea
          name="metaDescription"
          rows={2}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          maxLength={META_DESCRIPTION_MAX}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
        <p
          className={`mt-1 text-right text-xs ${
            metaDescription.length >= META_DESCRIPTION_MAX
              ? "text-red-600"
              : "text-neutral-400"
          }`}
        >
          {metaDescription.length} / {META_DESCRIPTION_MAX}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Thumbnail
        </label>
        <ThumbnailPicker
          name="thumbnail"
          initialUrl={initialPost?.thumbnail}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Type
        </label>
        <select
          name="type"
          defaultValue={initialPost?.type ?? PostType.OTHER}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        >
          {POST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Content
        </label>
        <RichTextEditor name="content" initialContent={initialPost?.content} />
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
