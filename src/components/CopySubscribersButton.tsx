"use client";

import { useState } from "react";

export default function CopySubscribersButton({
  emails,
}: {
  emails: string[];
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(emails.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={emails.length === 0}
      className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
    >
      {copied ? "Copied!" : `Copy all emails (${emails.length})`}
    </button>
  );
}
