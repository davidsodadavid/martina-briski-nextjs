import Link from "next/link";
import BreathTimerPreview from "@/components/BreathTimerPreview";
import BreathingCirclePreview from "@/components/BreathingCirclePreview";

export default function PracticeCardsGrid({
  practiceCards,
  cardsClassName,
  onNavigate,
  truncateLabels,
  uniformHeight,
}: {
  practiceCards: { label: string; href: string }[];
  cardsClassName: string;
  onNavigate?: () => void;
  truncateLabels?: boolean;
  uniformHeight?: boolean;
}) {
  return (
    <div className={cardsClassName}>
      {practiceCards.map((item, i) => {
        const isBreathTimer = item.href === "/practice/breath-timer";
        const isBreathingCircle = item.href === "/practice/breathing-circle";

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-[var(--nav-overlay-text)]/25 transition-colors hover:border-[var(--nav-highlight)] ${
              uniformHeight ? "h-[184px]" : isBreathingCircle ? "h-[153px]" : ""
            }`}
          >
            {isBreathTimer && <BreathTimerPreview className="h-16 w-full" />}
            {isBreathingCircle && (
              <BreathingCirclePreview className="absolute inset-0 h-full w-full" />
            )}
            <div
              className={`relative z-10 flex flex-col gap-2 p-5 pb-8 md:pb-5 ${
                isBreathTimer ? "pt-3" : isBreathingCircle ? "pt-[85px]" : ""
              }`}
            >
              <span
                className="text-xs tracking-[0.2em] text-[var(--nav-highlight)] uppercase"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-lg leading-[1.3] text-[var(--nav-overlay-text)]"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {truncateLabels
                  ? item.label.split(" ").slice(0, 2).join(" ")
                  : item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
