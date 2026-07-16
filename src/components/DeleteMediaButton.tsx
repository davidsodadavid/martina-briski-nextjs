"use client";

import { useTransition } from "react";
import { deleteMedia } from "@/app/actions/media";

export default function DeleteMediaButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this image? Posts using it will show a broken image."))
      return;
    startTransition(() => {
      deleteMedia(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
