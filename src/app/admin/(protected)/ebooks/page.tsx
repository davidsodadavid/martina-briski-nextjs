import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteEbookButton from "@/components/DeleteEbookButton";

export default async function AdminEbooksPage() {
  const ebooks = await prisma.ebook.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          Free content
        </h1>
        <Link
          href="/admin/ebooks/new"
          className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
        >
          New book
        </Link>
      </div>

      {ebooks.length === 0 ? (
        <p className="text-neutral-200">No books yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {ebooks.map((ebook) => (
            <li
              key={ebook.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{ebook.title}</span>
                <span className="text-xs text-neutral-400">
                  {ebook.pdfFilename}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href="/free-content"
                  className="text-sm text-neutral-500 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/admin/ebooks/${ebook.id}/edit`}
                  className="text-sm font-medium text-neutral-700 hover:underline"
                >
                  Edit
                </Link>
                <DeleteEbookButton id={ebook.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
