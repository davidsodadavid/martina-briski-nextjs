import ProgramForm from "@/components/ProgramForm";
import { createProgram } from "@/app/actions/programs";
import { prisma } from "@/lib/prisma";

export default async function NewProgramPage() {
  const mediaLibrary = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">New program</h1>
      <ProgramForm
        action={createProgram}
        submitLabel="Publish"
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
