import { prisma } from "@/lib/prisma";

/** Looks up admin-set alt text for a batch of image URLs (as managed via
 * ThumbnailPicker/GalleryPicker + the Media library). Falls back to
 * whatever the caller passes when a URL has no alt text set. */
export async function getAltMap(
  urls: (string | null | undefined)[]
): Promise<Record<string, string>> {
  const uniqueUrls = [...new Set(urls.filter((u): u is string => !!u))];
  if (uniqueUrls.length === 0) return {};

  const rows = await prisma.media.findMany({
    where: { url: { in: uniqueUrls } },
    select: { url: true, alt: true },
  });

  const map: Record<string, string> = {};
  for (const row of rows) {
    if (row.alt) map[row.url] = row.alt;
  }
  return map;
}
