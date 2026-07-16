"use client";

import { useTransition } from "react";
import { deletePost } from "@/app/actions/posts";

export default function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    startTransition(() => {
      deletePost(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
