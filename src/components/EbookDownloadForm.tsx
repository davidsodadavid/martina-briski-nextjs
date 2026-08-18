"use client";

import { useActionState } from "react";
import {
  requestEbookDownload,
  type EbookDownloadState,
} from "@/app/actions/ebooks";

const initialState: EbookDownloadState = {};

export default function EbookDownloadForm({ ebookId }: { ebookId: string }) {
  const boundRequest = requestEbookDownload.bind(null, ebookId);
  const [state, formAction, pending] = useActionState(
    boundRequest,
    initialState
  );

  if (state.success && state.pdfUrl) {
    return (
      <a
        href={state.pdfUrl}
        download={state.pdfFilename}
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-[var(--nav-highlight)] px-[30px] py-[15px] text-xs font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
      >
        Preuzmi PDF ↓
      </a>
    );
  }

  return (
    <form action={formAction} className="mt-10 flex w-full flex-col gap-2.5">
      <label className="mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[var(--nav-dark-text)]/60 uppercase">
        Unesi podatke za preuzimanje
      </label>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <input
          required
          name="firstName"
          type="text"
          placeholder="Ime"
          className="border border-[#D5D2C4] bg-[var(--nav-overlay-text)] px-[18px] py-3.5 text-[14.5px] text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none"
        />
        <input
          required
          name="lastName"
          type="text"
          placeholder="Prezime"
          className="border border-[#D5D2C4] bg-[var(--nav-overlay-text)] px-[18px] py-3.5 text-[14.5px] text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none"
        />
      </div>
      <input
        required
        name="email"
        type="email"
        placeholder="tvoj@email.com"
        className="border border-[#D5D2C4] bg-[var(--nav-overlay-text)] px-[18px] py-3.5 text-[14.5px] text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--nav-highlight)] p-3.5 text-xs font-medium tracking-[0.18em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)] disabled:opacity-50"
      >
        {pending ? "Slanje…" : "Otključaj preuzimanje"}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
