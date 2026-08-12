"use client";

import Image from "next/image";
import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";
import { useDict } from "@/components/LocaleProvider";
import TurnstileWidget from "@/components/TurnstileWidget";

const initialState: SubscribeState = {};

const PHOTO_URL =
  "https://pub-1144190a4cb1457da1471034790b3b55.r2.dev/media/Fotke gradske -18.jpg";

export default function SubscribeForm() {
  const dict = useDict();
  const [state, formAction, pending] = useActionState(
    subscribe,
    initialState
  );

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 md:[&>*]:min-h-[70vh]">
      <div className="relative min-h-[45vh] ml-[calc(-1*(24px+max(0px,50vw_-_24px_-_633.5px)))] w-[calc(100%+24px+max(0px,50vw_-_24px_-_633.5px))] md:ml-[calc(-1*(40px+max(0px,50vw_-_40px_-_633.5px)))] md:w-[calc(100%+40px+max(0px,50vw_-_40px_-_633.5px))]">
        <Image
          src={PHOTO_URL}
          alt=""
          fill
          className="object-cover grayscale"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 rounded-b-[20px] bg-[var(--nav-overlay-text)] p-8 md:rounded-b-none md:rounded-r-[20px] md:p-16">
        <div
          className="text-xs tracking-[0.28em] text-[var(--nav-dark-text)] uppercase"
          style={{ fontFamily: "var(--font-jost), sans-serif" }}
        >
          {dict.home.newsletterLabel}
        </div>
        <div
          className="max-w-[20ch] text-[clamp(26px,3.2vw,40px)] leading-[1.2] text-[#2E332F]"
          style={{ fontFamily: "var(--font-marcellus), serif" }}
        >
          {dict.home.newsletterTitle}
        </div>
        <p className="m-0 max-w-[40ch] text-base leading-[1.6] text-[#55605B]">
          {dict.home.newsletterText}
        </p>

        {state.success ? (
          <div className="mt-2 flex max-w-[420px] items-center gap-2.5 border border-[var(--nav-highlight)] bg-[var(--nav-highlight)]/25 px-[18px] py-3.5">
            <span className="text-[15px] text-[#2C3A2C]">✓</span>
            <span className="text-[13.5px] text-[#2C3A2C]">
              {dict.home.subscribed}
            </span>
          </div>
        ) : (
          <form
            action={formAction}
            className="mt-2 flex max-w-[420px] flex-col gap-2.5"
          >
            <input
              required
              name="email"
              type="email"
              placeholder={dict.home.emailPlaceholder}
              className="border border-[#D5D2C4] bg-[var(--nav-overlay-text)] px-[18px] py-3.5 text-[14.5px] text-[#2E332F] focus:border-[var(--nav-bg)] focus:outline-none"
            />
            <TurnstileWidget resetKey={state} />
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-[var(--nav-highlight)] p-3.5 text-xs font-medium tracking-[0.18em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)] disabled:opacity-50"
            >
              {pending ? dict.home.subscribing : dict.home.subscribe}
            </button>
            {state.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
