import { PostType } from "@/generated/prisma/enums";

const STYLES: Record<PostType, string> = {
  OTHER: "bg-neutral-100 text-neutral-800",
  ADAPTATION: "bg-blue-100 text-blue-800",
  PRANAYAMA: "bg-green-100 text-green-800",
  CALMING: "bg-purple-100 text-purple-800",
};

const LABELS: Record<PostType, string> = {
  OTHER: "Other",
  ADAPTATION: "Adaptation",
  PRANAYAMA: "Pranayama",
  CALMING: "Calming practice",
};

export default function PostTypeBadge({ type }: { type: PostType }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[type]}`}
    >
      {LABELS[type]}
    </span>
  );
}
