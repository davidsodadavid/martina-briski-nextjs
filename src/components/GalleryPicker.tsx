"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadMedia, updateMediaAlt } from "@/app/actions/media";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/uploads";

type MediaItem = { id: string; url: string; filename: string; alt: string | null };

export default function GalleryPicker({
  name,
  initialUrls,
  mediaLibrary,
}: {
  name: string;
  initialUrls: string[];
  mediaLibrary: MediaItem[];
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [error, setError] = useState<string | undefined>();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSavingAlt, startAltTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [idByUrl, setIdByUrl] = useState<Record<string, string>>(() =>
    Object.fromEntries(mediaLibrary.map((m) => [m.url, m.id]))
  );
  const [altByUrl, setAltByUrl] = useState<Record<string, string>>(() =>
    Object.fromEntries(mediaLibrary.map((m) => [m.url, m.alt ?? ""]))
  );

  function toggleUrl(url: string) {
    setUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  }

  function removeUrl(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  function handleAltBlur(url: string) {
    const id = idByUrl[url];
    if (!id) return;
    startAltTransition(() => updateMediaAlt(id, altByUrl[url] ?? ""));
  }

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
      } else if (result.url) {
        setUrls((prev) => [...prev, result.url as string]);
        if (result.id) {
          setIdByUrl((prev) => ({ ...prev, [result.url as string]: result.id as string }));
        }
      }
      e.target.value = "";
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url) => (
            <div key={url} className="flex w-20 flex-col gap-1">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                <Image src={url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeUrl(url)}
                  aria-label="Remove image"
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={altByUrl[url] ?? ""}
                onChange={(e) =>
                  setAltByUrl((prev) => ({ ...prev, [url]: e.target.value }))
                }
                onBlur={() => handleAltBlur(url)}
                placeholder="Alt text"
                disabled={!idByUrl[url]}
                className="w-full rounded-md border border-neutral-300 px-1.5 py-1 text-[11px] focus:border-neutral-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          ))}
          {isSavingAlt && (
            <p className="w-full text-[11px] text-neutral-400">Saving…</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="rounded-md bg-[var(--brand-yellow)] px-3 py-1.5 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
        >
          {isPending ? "Uploading…" : "Upload new"}
        </button>
        <button
          type="button"
          onClick={() => setLibraryOpen((open) => !open)}
          className="rounded-md bg-[var(--brand-yellow)] px-3 py-1.5 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
        >
          Choose from library
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {libraryOpen && (
        <div className="rounded-md border border-neutral-200 bg-white p-3">
          {mediaLibrary.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No media uploaded yet — use &ldquo;Upload new&rdquo; to add one.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mediaLibrary.map((m) => {
                const selected = urls.includes(m.url);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleUrl(m.url)}
                    title={m.filename}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                      selected
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
                    {selected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-lg font-bold text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
