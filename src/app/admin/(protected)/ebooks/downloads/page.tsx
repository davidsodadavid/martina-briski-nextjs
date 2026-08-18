import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteEbookDownloadButton from "@/components/DeleteEbookDownloadButton";

export default async function AdminEbookDownloadsPage() {
  const downloads = await prisma.ebookDownload.findMany({
    orderBy: { createdAt: "desc" },
    include: { ebook: { select: { title: true } } },
  });

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/ebooks"
          className="text-sm text-neutral-400 hover:underline"
        >
          ← Free content
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-white">
        Ljudi koji su preuzeli sadržaj
      </h1>

      {downloads.length === 0 ? (
        <p className="text-neutral-200">No downloads yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {downloads.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  {d.firstName} {d.lastName}
                </span>
                <span className="text-sm text-neutral-600">{d.email}</span>
                <span className="text-xs text-neutral-400">
                  {d.ebook.title} · {d.createdAt.toLocaleDateString()}
                </span>
              </div>
              <DeleteEbookDownloadButton id={d.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
