import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/ProductGallery";
import BuyButton from "@/components/BuyButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!product || !product.published) {
    notFound();
  }

  const gallery = Array.isArray(product.gallery)
    ? (product.gallery.filter((g) => typeof g === "string") as string[])
    : [];
  const images = product.thumbnail
    ? [product.thumbnail, ...gallery.filter((g) => g !== product.thumbnail)]
    : gallery;

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] text-[var(--nav-dark-text)]">
      <div className="mx-auto max-w-[1267px] px-6 md:px-10">
        {/* Back link */}
        <section className="pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-[var(--nav-bg)] uppercase hover:underline"
          >
            ← Natrag u trgovinu
          </Link>
        </section>

        {/* Product detail */}
        <section className="grid grid-cols-1 items-start gap-8 pt-6 md:grid-cols-[1.1fr_1fr] md:gap-14 md:pt-7">
          <ProductGallery images={images} alt={product.name} />

          <div className="flex flex-col gap-5">
            <div>
              <div
                className="mb-3 text-xs tracking-[0.24em] text-[var(--nav-dark-text)] uppercase"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                Iz trgovine
              </div>
              <h1
                className="text-[clamp(28px,4vw,46px)] leading-[1.15] font-normal"
                style={{ fontFamily: "var(--font-marcellus), serif" }}
              >
                {product.name}
              </h1>
            </div>

            <div
              className="text-[26px] text-[var(--nav-dark-text)]"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              {product.discountPrice != null ? (
                <>
                  <span className="mr-3 text-lg text-[#8A8371] line-through">
                    {product.price.toFixed(2)} €
                  </span>
                  {product.discountPrice.toFixed(2)} €
                </>
              ) : (
                `${product.price.toFixed(2)} €`
              )}
            </div>

            <div
              className="blog-article prose prose-neutral max-w-[46ch]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <BuyButton productId={product.id} productName={product.name} />
          </div>
        </section>

        {/* You might also like */}
        {related.length > 0 && (
          <section className="pt-16 pb-16 md:pt-24 md:pb-24">
            <h2
              className="mb-6 text-[clamp(24px,3vw,34px)] font-normal"
              style={{ fontFamily: "var(--font-marcellus), serif" }}
            >
              Moglo bi ti se svidjeti
            </h2>
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/shop/${prod.slug}`}
                  className="flex flex-col overflow-hidden border border-[#D5D2C4] bg-[var(--nav-overlay-text)]"
                >
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-[#D8D5C7]">
                    {prod.thumbnail && (
                      <Image
                        src={prod.thumbnail}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 p-4">
                    <div
                      className="text-base"
                      style={{ fontFamily: "var(--font-marcellus), serif" }}
                    >
                      {prod.name}
                    </div>
                    <div
                      className="text-[15px] text-[var(--nav-dark-text)]"
                      style={{ fontFamily: "var(--font-marcellus), serif" }}
                    >
                      {prod.discountPrice != null
                        ? `${prod.discountPrice.toFixed(2)} €`
                        : `${prod.price.toFixed(2)} €`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
