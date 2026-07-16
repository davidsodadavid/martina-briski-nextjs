import { prisma } from "@/lib/prisma";
import DeleteOrderButton from "@/components/DeleteOrderButton";
import CopyableEmail from "@/components/CopyableEmail";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-neutral-200">No orders yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-start justify-between gap-4 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4"
            >
              <div className="flex flex-col gap-1.5 text-sm">
                <div>
                  <span className="font-semibold text-neutral-500">
                    Product:
                  </span>{" "}
                  <span className="font-medium">
                    {order.productName}
                  </span>{" "}
                  · {order.quantity} × {order.price.toFixed(2)} €
                </div>
                <div>
                  <span className="font-semibold text-neutral-500">
                    From:
                  </span>{" "}
                  {order.name} · <CopyableEmail email={order.email} />
                  {order.phone ? ` · ${order.phone}` : ""}
                </div>
                <div>
                  <span className="font-semibold text-neutral-500">
                    Address:
                  </span>{" "}
                  {order.address}, {order.postalCode} {order.city}
                  {order.country ? `, ${order.country}` : ""}
                </div>
                {order.message && (
                  <div>
                    <span className="font-semibold text-neutral-500">
                      Note:
                    </span>{" "}
                    <span className="whitespace-pre-wrap text-neutral-700">
                      {order.message}
                    </span>
                  </div>
                )}
                <span className="text-xs text-neutral-400">
                  {order.createdAt.toLocaleString()}
                </span>
              </div>
              <DeleteOrderButton id={order.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
