import { prisma } from "@/lib/prisma";
import { stripHtml, truncate } from "@/lib/text";
import EventsCalendar, { type EventItem } from "@/components/EventsCalendar";

function toDateStr(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "asc" },
  });

  const items: EventItem[] = events.map((event) => {
    const startStr = toDateStr(event.date);
    const endStr = event.endTime ? toDateStr(event.endTime) : null;
    const isMultiDay = !!endStr && endStr !== startStr;
    const time = event.date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      id: event.id,
      ...(isMultiDay
        ? { dateStart: startStr, dateEnd: endStr as string }
        : { date: startStr }),
      time,
      title: event.title,
      location: event.location ?? "",
      description: truncate(stripHtml(event.description), 160),
      price: event.price ?? undefined,
      href: `/events/${event.slug}`,
    };
  });

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] px-6 text-[var(--nav-dark-text)] md:px-10">
      <div className="mx-auto max-w-[1267px]">
        {/* Hero */}
        <section className="pt-14 md:pt-20">
          <div
            className="mb-6 text-xs tracking-[0.28em] text-[var(--accent-clay)] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            Događanja i termini
          </div>
          <h1
            className="max-w-[18ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            Pronađi praksu koja ti odgovara
          </h1>
        </section>

        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--nav-dark-text)]/70">
            Trenutno nema događanja.
          </div>
        ) : (
          <EventsCalendar events={items} />
        )}
      </div>
    </main>
  );
}
