import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { stripHtml, truncate } from "@/lib/text";

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full flex-1 bg-[var(--nav-overlay-text)] px-6 text-[var(--nav-dark-text)] md:px-10">
      <div className="mx-auto max-w-[1267px]">
        {/* Hero */}
        <section className="pt-14 md:pt-20">
          <div
            className="mb-6 text-xs tracking-[0.28em] text-[var(--accent-clay)] uppercase"
            style={{ fontFamily: "var(--font-jost), sans-serif" }}
          >
            Trgovina
          </div>
          <h1
            className="max-w-[20ch] text-[clamp(32px,4.6vw,60px)] leading-[1.1] font-normal"
            style={{ fontFamily: "var(--font-marcellus), serif" }}
          >
            Oprema za tvoju praksu
          </h1>
        </section>

        {products.length === 0 ? (
          <div className="py-16 text-center text-[var(--nav-dark-text)]/70">
            Trenutno nema proizvoda.
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-[18px] py-16 sm:grid-cols-2 md:py-24 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden border border-[#D5D2C4] bg-[#F3F1E9]"
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative block aspect-4/5 w-full overflow-hidden bg-[#D8D5C7]"
                >
                  {product.thumbnail && (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2.5 p-[18px]">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="text-[clamp(16px,1.6vw,18px)] leading-[1.25] hover:underline"
                    style={{ fontFamily: "var(--font-marcellus), serif" }}
                  >
                    {product.name}
                  </Link>
                  <div className="text-[13px] leading-[1.5] text-[#55605B]">
                    {truncate(stripHtml(product.description), 90)}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2.5">
                    <span
                      className="text-lg text-[var(--accent-clay)]"
                      style={{ fontFamily: "var(--font-marcellus), serif" }}
                    >
                      {product.discountPrice != null ? (
                        <>
                          <span className="mr-2 text-sm text-[#3B443F]/50 line-through">
                            {product.price.toFixed(2)}
                          </span>
                          {product.discountPrice.toFixed(2)} €
                        </>
                      ) : (
                        `${product.price.toFixed(2)} €`
                      )}
                    </span>
                    <Link
                      href={`/shop/${product.slug}`}
                      className="inline-flex items-center rounded-full bg-[var(--nav-highlight)] px-4 py-2.5 text-[11px] font-medium tracking-[0.14em] text-[var(--nav-dark-text)] uppercase hover:bg-[var(--nav-highlight-dark)]"
                    >
                      Pogledaj
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
