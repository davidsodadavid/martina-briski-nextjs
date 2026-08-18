"use client";

import { useTransition } from "react";

export default function PublishToggle({
  published,
  onToggle,
  className = "text-neutral-600",
}: {
  published: boolean;
  onToggle: () => Promise<void>;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => onToggle())}
      disabled={isPending}
      aria-pressed={published}
      title={published ? "Published — click to unpublish" : "Unpublished — click to publish"}
      className={`flex items-center gap-2.5 text-xs font-medium disabled:opacity-50 ${className}`}
    >
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full ring-1 ring-inset ring-black/10 transition-colors ${
          published ? "bg-[var(--brand-green)]" : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            published ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
      {published ? "Published" : "Unpublished"}
    </button>
  );
}
