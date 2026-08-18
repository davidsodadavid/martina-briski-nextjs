import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/DeleteProductButton";
import PublishToggle from "@/components/PublishToggle";
import { toggleProductPublished } from "@/app/actions/products";

export default async function AdminShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Shop</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/shop/settings"
            className="rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Page settings
          </Link>
          <Link
            href="/admin/shop/new"
            className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)]"
          >
            New product
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-neutral-200">No products yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{product.name}</span>
                <span className="text-xs text-neutral-400">
                  {product.discountPrice != null ? (
                    <>
                      <span className="line-through">
                        {product.price.toFixed(2)}
                      </span>{" "}
                      {product.discountPrice.toFixed(2)}
                    </>
                  ) : (
                    product.price.toFixed(2)
                  )}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <PublishToggle
                  published={product.published}
                  onToggle={toggleProductPublished.bind(null, product.id)}
                />
                <Link
                  href={`/shop/${product.slug}`}
                  className="text-sm text-neutral-500 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/admin/shop/${product.id}/edit`}
                  className="text-sm font-medium text-neutral-700 hover:underline"
                >
                  Edit
                </Link>
                <DeleteProductButton id={product.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
