import EventForm from "@/components/EventForm";
import { createEvent } from "@/app/actions/events";
import { prisma } from "@/lib/prisma";

export default async function NewEventPage() {
  const mediaLibrary = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">New event</h1>
      <EventForm
        action={createEvent}
        submitLabel="Publish"
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
