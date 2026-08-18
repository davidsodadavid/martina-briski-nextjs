"use client";

import { useActionState } from "react";
import { applyToEvent, type ApplyState } from "@/app/actions/eventApplications";

const initialState: ApplyState = {};

const inputClassName =
  "border border-[#D5D2C4] bg-[var(--nav-overlay-text)] px-4 py-3.5 text-[15px] text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none";
const labelCapClassName =
  "text-[11px] font-medium tracking-[0.14em] text-[var(--nav-dark-text)]/60 uppercase";

export default function EventApplyForm({ eventId }: { eventId: string }) {
  const boundApply = applyToEvent.bind(null, eventId);
  const [state, formAction, pending] = useActionState(boundApply, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col gap-2 border border-[var(--nav-highlight)] bg-[var(--nav-highlight)]/25 p-7">
        <div
          className="text-xl text-[#2C3A2C]"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          Hvala na prijavi!
        </div>
        <div className="text-[14.5px] leading-[1.6] text-[#55605B]">
          Javit ćemo ti se uskoro.
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelCapClassName}>Ime</span>
          <input
            required
            name="name"
            type="text"
            placeholder="Tvoje ime"
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelCapClassName}>E-mail</span>
          <input
            required
            name="email"
            type="email"
            placeholder="tvoj@email.com"
            className={inputClassName}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelCapClassName}>Telefon</span>
        <input required name="phone" type="tel" className={inputClassName} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCapClassName}>Poruka</span>
        <textarea
          required
          name="message"
          placeholder="Napiši svoju poruku..."
          rows={4}
          className={`${inputClassName} resize-y`}
        />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1.5 self-start rounded-lg bg-[var(--nav-highlight)] px-[30px] py-[15px] text-xs font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)] disabled:opacity-50"
      >
        {pending ? "Slanje…" : "Prijavi se"}
      </button>
    </form>
  );
}
