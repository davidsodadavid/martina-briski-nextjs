import EbookForm from "@/components/EbookForm";
import { createEbook } from "@/app/actions/ebooks";
import { prisma } from "@/lib/prisma";

export default async function NewEbookPage() {
  const mediaLibrary = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">New book</h1>
      <EbookForm
        action={createEbook}
        submitLabel="Publish"
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
