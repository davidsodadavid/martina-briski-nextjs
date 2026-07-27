"use client";

import { useActionState } from "react";
import { applyToEvent, type ApplyState } from "@/app/actions/eventApplications";

const initialState: ApplyState = {};

export default function EventApplyForm({ eventId }: { eventId: string }) {
  const boundApply = applyToEvent.bind(null, eventId);
  const [state, formAction, pending] = useActionState(boundApply, initialState);

  if (state.success) {
    return (
      <p className="text-sm font-medium text-[var(--brand-green)]">
        Hvala na prijavi! Javit ćemo ti se uskoro.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Ime
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Telefon (neobavezno)
        </label>
        <input
          type="tel"
          name="phone"
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Poruka (neobavezno)
        </label>
        <textarea
          name="message"
          rows={3}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--brand-yellow)] px-5 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
      >
        {pending ? "Slanje…" : "Prijavi se"}
      </button>
    </form>
  );
}
