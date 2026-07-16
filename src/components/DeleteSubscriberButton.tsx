"use client";

import { useTransition } from "react";
import { deleteSubscriber } from "@/app/actions/subscribe";

export default function DeleteSubscriberButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Remove this subscriber?")) return;
    startTransition(() => {
      deleteSubscriber(id);
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
