"use client";

import { useTransition } from "react";
import { deleteEvent } from "@/app/actions/events";

export default function DeleteEventButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    startTransition(() => {
      deleteEvent(id);
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
