import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PRACTICE_ID, parseItems } from "@/lib/practice";
import PracticeSection from "@/components/PracticeSection";

export default async function PracticePage() {
  const practice = await prisma.practice.findUnique({
    where: { id: PRACTICE_ID },
  });

  if (!practice || !practice.published) {
    notFound();
  }

  const items = parseItems(practice.items);

  return (
    <main className="flex w-full flex-1 flex-col bg-[var(--nav-bg)] text-[var(--nav-overlay-text)] md:h-[calc(100vh-60px)]">
      <PracticeSection items={items} />
    </main>
  );
}
