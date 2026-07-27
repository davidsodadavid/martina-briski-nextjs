import Link from "next/link";
import CvForm from "@/components/CvForm";
import { prisma } from "@/lib/prisma";
import { CV_ID } from "@/lib/cv";

export default async function AdminCvPage() {
  const cv = await prisma.cv.findUnique({ where: { id: CV_ID } });

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">CV</h1>
        <Link
          href="/cv"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          See CV
        </Link>
      </div>
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
