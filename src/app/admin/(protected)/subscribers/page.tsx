import { prisma } from "@/lib/prisma";
import CopySubscribersButton from "@/components/CopySubscribersButton";
import DeleteSubscriberButton from "@/components/DeleteSubscriberButton";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const now = new Date().getTime();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Subscribers</h1>
        <CopySubscribersButton emails={subscribers.map((s) => s.email)} />
      </div>

      {subscribers.length === 0 ? (
        <p className="text-neutral-200">No subscribers yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-[var(--color-stone)]">
          {subscribers.map((sub) => (
            <li
              key={sub.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {sub.email}
                  {now - sub.createdAt.getTime() < THREE_DAYS_MS && (
                    <span className="rounded-full bg-[var(--brand-yellow)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-text)] uppercase">
                      New!
                    </span>
                  )}
                </span>
                <span className="text-xs text-neutral-400">
                  {sub.createdAt.toLocaleDateString()}
                </span>
              </div>
              <DeleteSubscriberButton id={sub.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
