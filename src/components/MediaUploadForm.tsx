"use client";

import { useRef, useState, useTransition } from "react";
import { uploadMedia } from "@/app/actions/media";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/uploads";

export default function MediaUploadForm() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`Image must be smaller than ${MAX_UPLOAD_MB}MB`);
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    setError(undefined);

    startTransition(async () => {
      const result = await uploadMedia({}, formData);
      if (result.error) {
        setError(result.error);
      }
      e.target.value = "";
    });
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
      >
        {isPending ? "Uploading…" : "Upload new"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
