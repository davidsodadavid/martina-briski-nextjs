"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadMedia, updateMediaAlt } from "@/app/actions/media";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/uploads";

type MediaItem = { id: string; url: string; filename: string; alt: string | null };

export default function ThumbnailPicker({
  name,
  initialUrl,
  mediaLibrary,
  allowUpload = true,
}: {
  name: string;
  initialUrl?: string | null;
  mediaLibrary: MediaItem[];
  allowUpload?: boolean;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [mediaId, setMediaId] = useState<string | null>(
    mediaLibrary.find((m) => m.url === initialUrl)?.id ?? null
  );
  const [alt, setAlt] = useState(
    mediaLibrary.find((m) => m.url === initialUrl)?.alt ?? ""
  );
  const [error, setError] = useState<string | undefined>();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSavingAlt, startAltTransition] = useTransition();
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
    setLibraryOpen(false);

    startTransition(async () => {
      const result = await uploadMedia({}, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
        setMediaId(result.id ?? null);
        setAlt("");
      }
      e.target.value = "";
    });
  }

  function selectFromLibrary(media: MediaItem) {
    setUrl(media.url);
    setMediaId(media.id);
    setAlt(media.alt ?? "");
    setError(undefined);
    setLibraryOpen(false);
  }

  function handleAltBlur() {
    if (!mediaId) return;
    startAltTransition(() => updateMediaAlt(mediaId, alt));
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={url} />
      {allowUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
          {url ? (
            <Image src={url} alt="" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="flex gap-2">
            {allowUpload && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="rounded-md bg-[var(--brand-yellow)] px-3 py-1.5 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
              >
                {isPending ? "Uploading…" : "Upload new"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setLibraryOpen((open) => !open)}
              className="rounded-md bg-[var(--brand-yellow)] px-3 py-1.5 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
            >
              Choose from library
            </button>
            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setMediaId(null);
                  setAlt("");
                }}
                className="text-sm text-neutral-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {url && (
            <div className="w-56">
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Alt text
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                onBlur={handleAltBlur}
                placeholder="Describe this image"
                disabled={!mediaId}
                className="w-full rounded-md border border-neutral-300 px-2 py-1 text-xs focus:border-neutral-500 focus:outline-none disabled:opacity-50"
              />
              {isSavingAlt && (
                <p className="mt-0.5 text-[11px] text-neutral-400">Saving…</p>
              )}
            </div>
          )}
        </div>
      </div>

      {libraryOpen && (
        <div className="rounded-md border border-neutral-200 bg-white p-3">
          {mediaLibrary.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No media uploaded yet — use &ldquo;Upload new&rdquo; to add one.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mediaLibrary.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectFromLibrary(m)}
                  title={m.filename}
                  className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${
                    url === m.url
                      ? "border-[var(--brand-yellow-dark)]"
                      : "border-transparent hover:border-neutral-300"
                  }`}
                >
                  <Image
                    src={m.url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
