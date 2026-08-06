import { notFound } from "next/navigation";
import ProgramForm from "@/components/ProgramForm";
import { prisma } from "@/lib/prisma";
import { updateProgram } from "@/app/actions/programs";
import { parseSteps } from "@/lib/program";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, mediaLibrary] = await Promise.all([
    prisma.program.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!program) {
    notFound();
  }

  const boundUpdateProgram = updateProgram.bind(null, program.id);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Edit program</h1>
      <ProgramForm
        action={boundUpdateProgram}
        submitLabel="Save changes"
        initialProgram={{
          name: program.name,
          thumbnail: program.thumbnail,
          description: program.description,
          tags: program.tags,
          galleryImages: program.galleryImages,
          pdfFilename: program.pdfFilename,
          steps: parseSteps(program.steps),
        }}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
