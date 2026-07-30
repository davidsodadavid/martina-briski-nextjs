import AboutForm from "@/components/AboutForm";
import { prisma } from "@/lib/prisma";
import { ABOUT_ID, parseSteps, emptySteps } from "@/lib/about";
import { listR2Objects } from "@/lib/r2";

export default async function AdminAboutPage() {
  const [about, mediaLibrary, pdfLibrary] = await Promise.all([
    prisma.about.findUnique({ where: { id: ABOUT_ID } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    listR2Objects("pdfs/"),
  ]);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">About</h1>
      <AboutForm
        initialAbout={{
          name: about?.name ?? "O meni",
          thumbnail: about?.thumbnail ?? null,
          steps: about ? parseSteps(about.steps) : emptySteps(),
          pdfUrl: about?.pdfUrl ?? null,
          pdfFilename: about?.pdfFilename ?? null,
        }}
        mediaLibrary={mediaLibrary}
        pdfLibrary={pdfLibrary}
      />
    </>
  );
}
