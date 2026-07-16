"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function MediaThumbnail({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative h-32 w-full cursor-pointer overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
      >
        <Image src={url} alt="" fill className="object-cover" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 text-white"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-4xl">
            <Image
              src={url}
              alt={filename}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
