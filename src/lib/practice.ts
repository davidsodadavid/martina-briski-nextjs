export const PRACTICE_ID = "practice";
export const PRACTICE_ITEM_COUNT = 3;

export type PracticeItem = {
  title: string;
  subtitle: string;
  description: string;
};

export function emptyItems(): PracticeItem[] {
  return Array.from({ length: PRACTICE_ITEM_COUNT }, () => ({
    title: "",
    subtitle: "",
    description: "",
  }));
}

export function parseItems(value: unknown): PracticeItem[] {
  if (!Array.isArray(value)) return emptyItems();
  return Array.from({ length: PRACTICE_ITEM_COUNT }, (_, i) => {
    const item = value[i];
    if (!item || typeof item !== "object") {
      return { title: "", subtitle: "", description: "" };
    }
    const s = item as Record<string, unknown>;
    return {
      title: typeof s.title === "string" ? s.title : "",
      subtitle: typeof s.subtitle === "string" ? s.subtitle : "",
      description: typeof s.description === "string" ? s.description : "",
    };
  });
}
