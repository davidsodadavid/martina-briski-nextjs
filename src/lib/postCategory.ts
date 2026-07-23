import { PostType } from "@/generated/prisma/enums";

export const CATEGORY_LABELS: Record<PostType, string> = {
  OTHER: "Ostalo",
  ADAPTATION: "Prilagodba",
  PRANAYAMA: "Pranayama",
  CALMING: "Umirujuća praksa",
};
