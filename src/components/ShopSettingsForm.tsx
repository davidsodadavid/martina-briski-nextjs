"use client";

import { useActionState } from "react";
import { saveShopSettings } from "@/app/actions/shopSettings";

export default function ShopSettingsForm({
  initialTitle,
  initialDescription,
}: {
  initialTitle: string | null;
  initialDescription: string | null;
}) {
  const [state, formAction, pending] = useActionState(saveShopSettings, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 rounded-md bg-[var(--color-stone)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Title
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Main heading shown on the public shop page, e.g. &quot;Oprema za
          tvoju praksu&quot;.
        </p>
        <input
          type="text"
          name="title"
          defaultValue={initialTitle ?? ""}
          placeholder="Oprema za tvoju praksu"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description (optional)
        </label>
        <p className="mb-2 text-xs text-neutral-500">
          Shown under the title on the public shop page.
        </p>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialDescription ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm font-medium text-[var(--brand-green)]">
          Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--brand-yellow)] px-5 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
