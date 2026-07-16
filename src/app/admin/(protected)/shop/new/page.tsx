import ProductForm from "@/components/ProductForm";
import { createProduct } from "@/app/actions/products";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const mediaLibrary = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">New product</h1>
      <ProductForm
        action={createProduct}
        submitLabel="Publish"
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
