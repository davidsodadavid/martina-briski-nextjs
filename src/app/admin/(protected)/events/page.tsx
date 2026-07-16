import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EventsTabs from "@/components/EventsTabs";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { applications: true } } },
  });

  const now = new Date();
  const upcoming = events.filter((e) => (e.endTime ?? e.date) >= now);
  const past = events.filter((e) => (e.endTime ?? e.date) < now).reverse();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Events</h1>
        <Link
          href="/admin/events/new"
          className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
        >
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-neutral-200">No events yet.</p>
      ) : (
        <EventsTabs upcoming={upcoming} past={past} />
      )}
    </>
  );
}
