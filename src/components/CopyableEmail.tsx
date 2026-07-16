"use client";

import { useState } from "react";

export default function CopyableEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-neutral-600 underline decoration-dotted underline-offset-2 hover:text-neutral-900"
      title="Click to copy"
    >
      {copied ? "Copied!" : email}
    </button>
  );
}
