import { notFound } from "next/navigation";
import EbookForm from "@/components/EbookForm";
import { prisma } from "@/lib/prisma";
import { updateEbook } from "@/app/actions/ebooks";

export default async function EditEbookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [ebook, mediaLibrary] = await Promise.all([
    prisma.ebook.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!ebook) {
    notFound();
  }

  const boundUpdateEbook = updateEbook.bind(null, ebook.id);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Edit book</h1>
      <EbookForm
        action={boundUpdateEbook}
        submitLabel="Save changes"
        initialEbook={ebook}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
