import CvForm from "@/components/CvForm";
import { prisma } from "@/lib/prisma";
import { CV_ID } from "@/lib/cv";

export default async function AdminCvPage() {
  const cv = await prisma.cv.findUnique({ where: { id: CV_ID } });

  return (
    <>
      <h1 className="mb-2 text-xl font-semibold text-white">CV</h1>
      <p className="mb-6 text-sm text-neutral-300">
        Not linked anywhere on the site — share{" "}
        <span className="text-white">/cv</span> directly with clients.
      </p>
      <CvForm
        initialTitle={cv?.title ?? "Martina Briški"}
        initialSubtitle={cv?.subtitle ?? null}
        initialDescription={cv?.description ?? null}
      />
    </>
  );
}
