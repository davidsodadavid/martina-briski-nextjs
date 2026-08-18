"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteEventButton from "@/components/DeleteEventButton";
import PublishToggle from "@/components/PublishToggle";
import { toggleEventPublished } from "@/app/actions/events";
import { formatEventTiming } from "@/lib/eventTime";
import type { prisma } from "@/lib/prisma";

type EventWithCount = Awaited<
  ReturnType<
    typeof prisma.event.findMany<{
      include: { _count: { select: { applications: true } } };
    }>
  >
>[number];

function EventList({ events }: { events: EventWithCount[] }) {
  if (events.length === 0) {
    return <p className="text-neutral-200">No events here.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium">{event.title}</span>
            <span className="text-xs text-neutral-400">
              {formatEventTiming(event.date, event.endTime)}
              {event.location ? ` · ${event.location}` : ""}
              {event.price ? ` · ${event.price}` : ""}
            </span>
            <span className="text-xs text-neutral-500">
              {event._count.applications === 0
                ? "No participants yet"
                : `${event._count.applications} participant${event._count.applications === 1 ? "" : "s"}`}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <PublishToggle
              published={event.published}
              onToggle={toggleEventPublished.bind(null, event.id)}
            />
            <Link
              href={`/events/${event.slug}`}
              className="text-sm text-neutral-500 hover:underline"
            >
              View
            </Link>
            <Link
              href={`/admin/events/${event.id}/edit`}
              className="text-sm font-medium text-neutral-700 hover:underline"
            >
              Edit
            </Link>
            <DeleteEventButton id={event.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function EventsTabs({
  upcoming,
  past,
}: {
  upcoming: EventWithCount[];
  past: EventWithCount[];
}) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("upcoming")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "upcoming"
              ? "bg-[var(--brand-yellow)] text-[var(--brand-text)]"
              : "bg-white/10 text-white/80 hover:bg-white/15"
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("past")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "past"
              ? "bg-[var(--brand-yellow)] text-[var(--brand-text)]"
              : "bg-white/10 text-white/80 hover:bg-white/15"
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      <EventList events={tab === "upcoming" ? upcoming : past} />
    </div>
  );
}
