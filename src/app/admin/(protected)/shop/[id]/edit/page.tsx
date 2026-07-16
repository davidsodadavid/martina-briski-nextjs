import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, mediaLibrary] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const boundUpdateProduct = updateProduct.bind(null, product.id);
  const gallery = Array.isArray(product.gallery)
    ? (product.gallery.filter((g) => typeof g === "string") as string[])
    : [];

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Edit product</h1>
      <ProductForm
        action={boundUpdateProduct}
        submitLabel="Save changes"
        initialProduct={{
          name: product.name,
          thumbnail: product.thumbnail,
          gallery,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
        }}
        mediaLibrary={mediaLibrary}
      />
    </>
  );
}
