"use client";

import { useTransition } from "react";
import { deleteEbookDownload } from "@/app/actions/ebooks";

export default function DeleteEbookDownloadButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this download record? This cannot be undone.")) return;
    startTransition(() => {
      deleteEbookDownload(id);
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
