import { notFound } from "next/navigation";
import EbookForm from "@/components/EbookForm";
import PublishToggle from "@/components/PublishToggle";
import { prisma } from "@/lib/prisma";
import { updateEbook, toggleEbookPublished } from "@/app/actions/ebooks";

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Edit book</h1>
        <PublishToggle
          published={ebook.published}
          onToggle={toggleEbookPublished.bind(null, ebook.id)}
          className="text-neutral-300"
        />
      </div>
      <EbookForm
        action={boundUpdateEbook}
        submitLabel="Save changes"
        initialEbook={ebook}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
