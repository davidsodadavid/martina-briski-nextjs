import PracticeForm from "@/components/PracticeForm";
import { prisma } from "@/lib/prisma";
import { PRACTICE_ID, parseItems, emptyItems } from "@/lib/practice";

export default async function AdminPracticePage() {
  const practice = await prisma.practice.findUnique({
    where: { id: PRACTICE_ID },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Practice</h1>
      <PracticeForm
        initialPractice={{
          name: practice?.name ?? "Practice",
          items: practice ? parseItems(practice.items) : emptyItems(),
        }}
      />
    </>
  );
}
