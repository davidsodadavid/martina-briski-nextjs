"use client";

import { useActionState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import type { PostFormState } from "@/app/actions/posts";
import { PostType } from "@/generated/prisma/enums";

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
    thumbnail: string | null;
    content: string;
    type: PostType;
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
