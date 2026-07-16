import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteEventApplicationButton from "@/components/DeleteEventApplicationButton";

export default async function AdminParticipantsPage() {
  const applications = await prisma.eventApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Participants</h1>

      {applications.length === 0 ? (
        <p className="text-neutral-200">No one has applied to an event yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {applications.map((app) => (
            <li
              key={app.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{app.name}</span>
                <span className="text-sm text-neutral-600">
                  {app.email}
                  {app.phone ? ` · ${app.phone}` : ""}
                </span>
                {app.message && (
                  <span className="text-sm text-neutral-500">
                    {app.message}
                  </span>
                )}
                <span className="text-xs text-neutral-400">
                  Applied to{" "}
                  <Link
                    href={`/admin/events/${app.event.id}/edit`}
                    className="underline hover:text-neutral-600"
                  >
                    {app.event.title}
                  </Link>
                  {" · "}
                  {app.createdAt.toLocaleString()}
                </span>
              </div>
              <DeleteEventApplicationButton id={app.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
