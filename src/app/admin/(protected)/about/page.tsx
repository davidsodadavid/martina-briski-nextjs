import AboutForm from "@/components/AboutForm";
import { prisma } from "@/lib/prisma";
import { ABOUT_ID, parseSteps, emptySteps } from "@/lib/about";

export default async function AdminAboutPage() {
  const [about, mediaLibrary] = await Promise.all([
    prisma.about.findUnique({ where: { id: ABOUT_ID } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">About</h1>
      <AboutForm
        initialAbout={{
          name: about?.name ?? "O meni",
          thumbnail: about?.thumbnail ?? null,
          steps: about ? parseSteps(about.steps) : emptySteps(),
        }}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
