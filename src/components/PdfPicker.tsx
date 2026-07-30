"use client";

import { useRef, useState, useTransition } from "react";
import { uploadPdf } from "@/app/actions/pdfs";
import { MAX_PDF_BYTES, MAX_PDF_MB } from "@/lib/uploads";

type PdfItem = { key: string; url: string; filename: string };

export default function PdfPicker({
  urlFieldName,
  filenameFieldName,
  initialUrl,
  initialFilename,
  pdfLibrary,
}: {
  urlFieldName: string;
  filenameFieldName: string;
  initialUrl?: string | null;
  initialFilename?: string | null;
  pdfLibrary: PdfItem[];
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [filename, setFilename] = useState(initialFilename ?? "");
  const [error, setError] = useState<string | undefined>();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PDF_BYTES) {
      setError(`PDF must be smaller than ${MAX_PDF_MB}MB`);
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    setError(undefined);
    setLibraryOpen(false);

    startTransition(async () => {
      const result = await uploadPdf({}, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
        setFilename(result.filename ?? "");
      }
      e.target.value = "";
    });
  }

  function selectFromLibrary(item: PdfItem) {
    setUrl(item.url);
    setFilename(item.filename);
    setError(undefined);
    setLibraryOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={urlFieldName} value={url} />
      <input type="hidden" name={filenameFieldName} value={filename} />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-3">
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
        {url && (
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setFilename("");
            }}
            className="text-sm text-neutral-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      {filename && <p className="text-sm text-neutral-600">{filename}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {libraryOpen && (
        <div className="rounded-md border border-neutral-200 bg-white p-3">
          {pdfLibrary.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No PDFs on R2 yet — use &quot;Upload new&quot; to add one.
            </p>
          ) : (
            <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto">
              {pdfLibrary.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => selectFromLibrary(item)}
                    title={item.filename}
                    className={`w-full truncate rounded-md px-2 py-1.5 text-left text-sm hover:bg-neutral-100 ${
                      url === item.url
                        ? "bg-[var(--brand-yellow)]/40 font-medium"
                        : ""
                    }`}
                  >
                    {item.filename}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
