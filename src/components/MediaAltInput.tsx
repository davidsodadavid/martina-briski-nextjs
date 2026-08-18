"use client";

import { useState, useTransition } from "react";
import { updateMediaAlt } from "@/app/actions/media";

export default function MediaAltInput({
  id,
  initialAlt,
}: {
  id: string;
  initialAlt: string | null;
}) {
  const [alt, setAlt] = useState(initialAlt ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <input
        type="text"
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        onBlur={() => startTransition(() => updateMediaAlt(id, alt))}
        placeholder="Alt text"
        className="w-full rounded-md border border-neutral-300 px-2 py-1 text-xs focus:border-neutral-500 focus:outline-none"
      />
      {isPending && (
        <p className="mt-0.5 text-[10px] text-neutral-400">Saving…</p>
      )}
    </div>
  );
}
