import { prisma } from "@/lib/prisma";
import DeleteContactMessageButton from "@/components/DeleteContactMessageButton";
import CopyableEmail from "@/components/CopyableEmail";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Messages</h1>

      {messages.length === 0 ? (
        <p className="text-neutral-200">No messages yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="flex items-start justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1.5 text-sm">
                <div>
                  <span className="font-semibold text-neutral-500">
                    Title:
                  </span>{" "}
                  <span className="font-medium">{msg.topic}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-500">
                    From:
                  </span>{" "}
                  {msg.name} · <CopyableEmail email={msg.email} />
                </div>
                <div>
                  <span className="font-semibold text-neutral-500">
                    Message:
                  </span>{" "}
                  <span className="whitespace-pre-wrap text-neutral-700">
                    {msg.message}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">
                  {msg.createdAt.toLocaleString()}
                </span>
              </div>
              <DeleteContactMessageButton id={msg.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
