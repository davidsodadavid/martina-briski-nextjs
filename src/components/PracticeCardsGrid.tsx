import Link from "next/link";

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
      {practiceCards.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`relative flex flex-col gap-2 overflow-hidden border border-[var(--nav-overlay-text)]/25 transition-colors hover:border-[var(--nav-highlight)] ${
              uniformHeight ? "h-[184px]" : ""
            }`}
          >
            <div className="relative z-10 flex flex-col gap-2 p-5 pb-8 md:pb-5">
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
