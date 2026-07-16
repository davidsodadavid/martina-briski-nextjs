import { PostType } from "@/generated/prisma/enums";

export const CATEGORY_LABELS: Record<PostType, string> = {
  NEWS: "Novosti",
  TUTORIAL: "Vodič",
  OPINION: "Mišljenje",
};
