"use client";

import { useTransition } from "react";
import { deleteProgram } from "@/app/actions/programs";

export default function DeleteProgramButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this program? This cannot be undone.")) return;
    startTransition(() => {
      deleteProgram(id);
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
