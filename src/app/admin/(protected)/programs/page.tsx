import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProgramButton from "@/components/DeleteProgramButton";

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Programs</h1>
        <Link
          href="/admin/programs/new"
          className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
        >
          New program
        </Link>
      </div>

      {programs.length === 0 ? (
        <p className="text-neutral-200">No programs yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {programs.map((program) => (
            <li
              key={program.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{program.name}</span>
                <span className="text-xs text-neutral-400">
                  {program.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/programs/${program.slug}`}
                  className="text-sm text-neutral-500 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/admin/programs/${program.id}/edit`}
                  className="text-sm font-medium text-neutral-700 hover:underline"
                >
                  Edit
                </Link>
                <DeleteProgramButton id={program.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
