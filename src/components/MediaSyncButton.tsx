"use client";

import { useActionState } from "react";
import { syncMediaFromR2, type SyncState } from "@/app/actions/media";

const initialState: SyncState = {};

export default function MediaSyncButton() {
  const [state, formAction, pending] = useActionState(
    syncMediaFromR2,
    initialState
  );

  return (
    <form action={formAction} className="flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "Syncing…" : "Sync from R2"}
      </button>
      {state.error && <p className="text-sm text-red-300">{state.error}</p>}
      {state.added !== undefined && (
        <p className="text-sm text-white/80">
          {state.added > 0
            ? `Added ${state.added} file${state.added === 1 ? "" : "s"} from R2.`
            : "Already up to date."}
        </p>
      )}
    </form>
  );
}
