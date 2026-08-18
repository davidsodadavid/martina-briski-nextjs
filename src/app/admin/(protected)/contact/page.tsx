import ContactSettingsForm from "@/components/ContactSettingsForm";
import { prisma } from "@/lib/prisma";
import { CONTACT_SETTINGS_ID } from "@/lib/contactSettings";

export default async function AdminContactSettingsPage() {
  const [settings, mediaLibrary] = await Promise.all([
    prisma.contactSettings.findUnique({ where: { id: CONTACT_SETTINGS_ID } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">
        Contact page
      </h1>
      <ContactSettingsForm
        initialHeroPhoto={settings?.heroPhoto ?? null}
        initialLabel={settings?.label ?? null}
        initialHeading={settings?.heading ?? null}
        initialText={settings?.text ?? null}
        initialNote={settings?.note ?? null}
        initialEmail={settings?.email ?? null}
        initialMapAddress={settings?.mapAddress ?? null}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
