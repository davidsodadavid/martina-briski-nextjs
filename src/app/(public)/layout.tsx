import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { getLocale, getDictionary } from "@/lib/i18n";
import { LocaleProvider } from "@/components/LocaleProvider";
import HideOnRoutes from "@/components/HideOnRoutes";

// All public pages read from the database — render them per-request so new
// content shows up without a rebuild (and `next build` needs no live DB).
export const dynamic = "force-dynamic";

export default async function PublicLayout({
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
    <div
      id="top"
      className="flex min-h-screen w-full flex-1 flex-col bg-[#5F6D6A]"
    >
      <LocaleProvider locale={locale} dict={dict}>
        <SiteHeader programs={programs} />
        {children}
        <HideOnRoutes routes={["/", "/practice", "/contact"]}>
          <SiteFooter dict={dict} />
        </HideOnRoutes>
      </LocaleProvider>
    </div>
  );
}
