"use client";

import { useActionState } from "react";
import { applyToEvent, type ApplyState } from "@/app/actions/eventApplications";

const initialState: ApplyState = {};

const inputClassName =
  "border border-[#F8F6EF] bg-[#F8F6EF] px-4 py-3 text-[15px] text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none";
const labelClassName =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[var(--nav-bg)] uppercase";

export default function EventApplyForm({ eventId }: { eventId: string }) {
  const boundApply = applyToEvent.bind(null, eventId);
  const [state, formAction, pending] = useActionState(boundApply, initialState);

  if (state.success) {
    return (
      <p
        className="text-[15px]"
        style={{ fontFamily: "var(--font-marcellus), serif" }}
      >
        Hvala na prijavi! Javit ćemo ti se uskoro.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[18px]"
      style={{ fontFamily: "var(--font-jost), sans-serif" }}
    >
      <div>
        <label className={labelClassName}>Ime</label>
        <input type="text" name="name" required className={inputClassName} />
      </div>

      <div>
        <label className={labelClassName}>E-mail</label>
        <input type="email" name="email" required className={inputClassName} />
      </div>

      <div>
        <label className={labelClassName}>Telefon (neobavezno)</label>
        <input type="tel" name="phone" className={inputClassName} />
      </div>

      <div>
        <label className={labelClassName}>Poruka (neobavezno)</label>
        <textarea name="message" rows={3} className={`${inputClassName} resize-y`} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1.5 self-start rounded-full bg-[var(--nav-highlight)] px-[30px] py-[15px] text-xs font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)] disabled:opacity-50"
      >
        {pending ? "Slanje…" : "Prijavi se"}
      </button>
    </form>
  );
}
