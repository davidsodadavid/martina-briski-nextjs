import Link from "next/link";
import FreeContentSettingsForm from "@/components/FreeContentSettingsForm";
import { prisma } from "@/lib/prisma";
import { FREE_CONTENT_SETTINGS_ID } from "@/lib/freeContentSettings";

export default async function AdminFreeContentSettingsPage() {
  const [settings, mediaLibrary] = await Promise.all([
    prisma.freeContentSettings.findUnique({
      where: { id: FREE_CONTENT_SETTINGS_ID },
    }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/ebooks"
          className="text-sm text-neutral-400 hover:underline"
        >
          ← Free content
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-white">
        Free content settings
      </h1>
      <FreeContentSettingsForm
        initialCoverImage={settings?.coverImage ?? null}
        initialDescription={settings?.description ?? null}
        initialLabel={settings?.label ?? null}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
