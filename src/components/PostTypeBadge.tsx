import { PostType } from "@/generated/prisma/enums";

const STYLES: Record<PostType, string> = {
  NEWS: "bg-blue-100 text-blue-800",
  TUTORIAL: "bg-green-100 text-green-800",
  OPINION: "bg-purple-100 text-purple-800",
};

const LABELS: Record<PostType, string> = {
  NEWS: "News",
  TUTORIAL: "Tutorial",
  OPINION: "Opinion",
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
