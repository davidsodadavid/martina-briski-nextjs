import { notFound } from "next/navigation";
import EventForm from "@/components/EventForm";
import DeleteEventApplicationButton from "@/components/DeleteEventApplicationButton";
import { prisma } from "@/lib/prisma";
import { updateEvent } from "@/app/actions/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, mediaLibrary, applications] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.eventApplication.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!event) {
    notFound();
  }

  const boundUpdateEvent = updateEvent.bind(null, event.id);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Edit event</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Applicants ({applications.length})
        </h2>
        {applications.length === 0 ? (
          <p className="text-neutral-200">No one has applied yet.</p>
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
                    {app.createdAt.toLocaleString()}
                  </span>
                </div>
                <DeleteEventApplicationButton id={app.id} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <EventForm
        action={boundUpdateEvent}
        submitLabel="Save changes"
        initialEvent={event}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
