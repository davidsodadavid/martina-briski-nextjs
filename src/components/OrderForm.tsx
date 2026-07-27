"use client";

import { useActionState } from "react";
import { submitOrder, type OrderFormState } from "@/app/actions/orders";

const initialState: OrderFormState = {};

const inputClassName =
  "border border-[#D5D2C4] bg-[#F8F6EF] px-3 py-2 text-sm text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none";
const labelClassName = "mb-1 block text-sm font-medium text-[#3B443F]";

export default function OrderForm({
  productId,
  productName,
}: {
  productId: string;
  productName?: string;
}) {
  const boundSubmitOrder = submitOrder.bind(null, productId);
  const [state, formAction, pending] = useActionState(
    boundSubmitOrder,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-[var(--nav-highlight)] bg-[var(--nav-highlight)]/25 p-6">
        <div
          className="text-lg text-[#2C3A2C]"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          Hvala na narudžbi!
        </div>
        <div className="text-sm leading-[1.6] text-[#2C3A2C]">
          Javit ćemo ti se uskoro s detaljima plaćanja i dostave.
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div
        className="text-base"
        style={{ fontFamily: "var(--font-marcellus), serif" }}
      >
        {productName ? `Naruči: ${productName}` : "Naruči ovaj proizvod"}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Ime</label>
          <input
            required
            name="name"
            type="text"
            className={`w-full ${inputClassName}`}
          />
        </div>
        <div>
          <label className={labelClassName}>E-mail</label>
          <input
            required
            name="email"
            type="email"
            className={`w-full ${inputClassName}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Telefon (neobavezno)</label>
          <input type="tel" name="phone" className={`w-full ${inputClassName}`} />
        </div>
        <div>
          <label className={labelClassName}>Količina</label>
          <input
            type="number"
            name="quantity"
            min={1}
            defaultValue={1}
            className={`w-full ${inputClassName}`}
          />
        </div>
      </div>

      <div>
        <label className={labelClassName}>Adresa za dostavu</label>
        <input
          required
          name="address"
          type="text"
          placeholder="Ulica i kućni broj"
          className={`w-full ${inputClassName}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1.2fr]">
        <div>
          <label className={labelClassName}>Poštanski broj</label>
          <input
            required
            name="postalCode"
            type="text"
            className={`w-full ${inputClassName}`}
          />
        </div>
        <div>
          <label className={labelClassName}>Grad</label>
          <input
            required
            name="city"
            type="text"
            className={`w-full ${inputClassName}`}
          />
        </div>
        <div>
          <label className={labelClassName}>Država</label>
          <input
            name="country"
            type="text"
            defaultValue="Hrvatska"
            className={`w-full ${inputClassName}`}
          />
        </div>
      </div>

      <div>
        <label className={labelClassName}>Napomena (neobavezno)</label>
        <textarea
          name="message"
          rows={3}
          placeholder="Npr. željena boja ili veličina"
          className={`w-full ${inputClassName}`}
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-[#3B443F]">
        <input
          required
          type="checkbox"
          name="consent"
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--nav-highlight)]"
        />
        <span>
          Slažem se da se moji podaci pohrane i koriste isključivo za
          obradu ove narudžbe.
        </span>
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-[var(--nav-highlight)] px-[34px] py-4 text-[13px] font-medium tracking-[0.2em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)] disabled:opacity-50"
      >
        {pending ? "Slanje…" : "Naruči"}
      </button>
    </form>
  );
}
