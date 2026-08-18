import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventApplyForm from "@/components/EventApplyForm";
import { formatEventTiming } from "@/lib/eventTime";
import { getAltMap } from "@/lib/mediaAlt";

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

  const altMap = await getAltMap([event.thumbnail]);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      <div className="mx-auto max-w-[800px] px-6 py-14 md:px-10 md:py-20">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-[var(--nav-dark-text)]/60 uppercase hover:text-[var(--nav-dark-text)]"
        >
          ← Sva događanja
        </Link>

        <div className="mt-7">
          <h1
            className="mb-3 text-[clamp(28px,4vw,46px)] leading-[1.2] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            {event.title}
          </h1>
          <p className="text-[13px] text-[#8A8371]">
            {formatEventTiming(event.date, event.endTime)}
            {event.location ? ` · ${event.location}` : ""}
          </p>
          {event.price && (
            <p
              className="mt-2 text-lg text-[var(--nav-dark-text)]"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {event.price}
            </p>
          )}
        </div>

        {event.thumbnail && (
          <div className="relative mt-8 aspect-21/9 w-full overflow-hidden">
            <Image
              src={event.thumbnail}
              alt={altMap[event.thumbnail] ?? event.title}
              fill
              className="object-cover grayscale"
            />
          </div>
        )}

        <div
          className="blog-article prose prose-neutral mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        <div className="mt-14 border border-[#D5D2C4] bg-[var(--nav-overlay-text)] p-7 md:p-8">
          <h2
            className="mb-5 text-xl"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            Prijavi se na ovo događanje
          </h2>
          <EventApplyForm eventId={event.id} />
        </div>
      </div>
    </main>
  );
}
