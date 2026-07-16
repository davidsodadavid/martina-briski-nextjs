export const ABOUT_ID = "about";
export const ABOUT_STEP_COUNT = 4;

export type AboutStep = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export function emptySteps(): AboutStep[] {
  return Array.from({ length: ABOUT_STEP_COUNT }, () => ({
    title: "",
    subtitle: "",
    description: "",
    image: "",
  }));
}

export function parseSteps(value: unknown): AboutStep[] {
  if (!Array.isArray(value)) return emptySteps();
  return Array.from({ length: ABOUT_STEP_COUNT }, (_, i) => {
    const step = value[i];
    if (!step || typeof step !== "object") {
      return { title: "", subtitle: "", description: "", image: "" };
    }
    const s = step as Record<string, unknown>;
    return {
      title: typeof s.title === "string" ? s.title : "",
      subtitle: typeof s.subtitle === "string" ? s.subtitle : "",
      description: typeof s.description === "string" ? s.description : "",
      image: typeof s.image === "string" ? s.image : "",
    };
  });
}
