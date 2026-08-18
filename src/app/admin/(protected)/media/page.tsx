import MediaUploadForm from "@/components/MediaUploadForm";
import MediaSyncButton from "@/components/MediaSyncButton";
import MediaThumbnail from "@/components/MediaThumbnail";
import MediaAltInput from "@/components/MediaAltInput";
import DeleteMediaButton from "@/components/DeleteMediaButton";
import { prisma } from "@/lib/prisma";

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Media</h1>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <MediaUploadForm />
        <MediaSyncButton />
      </div>

      {media.length === 0 ? (
        <p className="text-neutral-200">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="flex flex-col gap-2 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-2"
            >
              <MediaThumbnail url={m.url} filename={m.filename} />
              <span className="truncate text-xs text-neutral-500">
                {m.filename}
              </span>
              <MediaAltInput id={m.id} initialAlt={m.alt} />
              <DeleteMediaButton id={m.id} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
