import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventApplyForm from "@/components/EventApplyForm";
import { formatEventTiming } from "@/lib/eventTime";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event || !event.published) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:py-16">
      <Link href="/events" className="text-sm text-white/70 hover:underline">
        ← Natrag na sva događanja
      </Link>

      <div className="mt-6 rounded-xl bg-[var(--color-stone)] p-6 md:p-8">
        <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
        <div className="mb-6">
          <p className="text-sm text-neutral-500">
            {formatEventTiming(event.date, event.endTime)}
            {event.location ? ` · ${event.location}` : ""}
          </p>
          {event.price && (
            <p className="mt-1 text-lg font-medium text-[var(--accent-clay)]">
              {event.price}
            </p>
          )}
        </div>

        {event.thumbnail && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={event.thumbnail}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </div>

      <div className="mt-6 rounded-xl bg-[var(--color-stone)] p-6 md:p-8">
        <h2 className="mb-4 text-xl font-semibold">Prijavi se na ovo događanje</h2>
        <EventApplyForm eventId={event.id} />
      </div>
    </main>
  );
}
