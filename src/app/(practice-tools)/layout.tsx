import SiteHeader from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { getLocale, getDictionary } from "@/lib/i18n";
import { LocaleProvider } from "@/components/LocaleProvider";

export default async function PracticeToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [programs, locale] = await Promise.all([
    prisma.program.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { name: true, slug: true },
    }),
    getLocale(),
  ]);
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-[#5F6D6A]">
      <LocaleProvider locale={locale} dict={dict}>
        <SiteHeader programs={programs} />
        {children}
      </LocaleProvider>
    </div>
  );
}
