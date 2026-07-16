"use client";

import { useTransition } from "react";
import { deleteEventApplication } from "@/app/actions/eventApplications";

export default function DeleteEventApplicationButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Remove this applicant?")) return;
    startTransition(() => {
      deleteEventApplication(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Removing…" : "Remove"}
    </button>
  );
}
