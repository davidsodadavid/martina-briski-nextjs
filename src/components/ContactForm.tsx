"use client";

import { useActionState } from "react";
import {
  submitContactMessage,
  type ContactFormState,
} from "@/app/actions/contact";
import TurnstileWidget from "@/components/TurnstileWidget";

const initialState: ContactFormState = {};

const inputClassName =
  "border border-[var(--nav-overlay-text)] bg-[var(--nav-overlay-text)] px-4 py-3.5 text-[15px] text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none";
const labelCapClassName =
  "text-[11px] font-medium tracking-[0.14em] text-[var(--nav-highlight)] uppercase";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col gap-2 border border-[var(--nav-highlight)] bg-[var(--nav-overlay-text)] p-7">
        <div
          className="text-xl"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          Hvala na poruci!
        </div>
        <div className="text-[14.5px] leading-[1.6] text-[#55605B]">
          Javit ću se što prije mogu, obično u roku 1–2 dana.
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
        <span className={labelCapClassName}>Tema</span>
        <select name="topic" className={`${inputClassName} appearance-none`}>
          <option>Opće pitanje</option>
          <option>Programi i sati</option>
          <option>Privatni mentorski</option>
          <option>Suradnja</option>
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCapClassName}>Poruka</span>
        <textarea
          required
          name="message"
          placeholder="Napiši svoju poruku..."
          rows={6}
          className={`${inputClassName} resize-y`}
        />
      </label>

      <TurnstileWidget resetKey={state} />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1.5 self-start rounded-lg bg-[var(--nav-highlight)] px-[30px] py-[15px] text-xs font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)] disabled:opacity-50"
      >
        {pending ? "Slanje…" : "Pošalji poruku"}
      </button>
    </form>
  );
}
