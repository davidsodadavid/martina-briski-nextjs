import Link from "next/link";
import ShopSettingsForm from "@/components/ShopSettingsForm";
import { prisma } from "@/lib/prisma";
import { SHOP_SETTINGS_ID } from "@/lib/shopSettings";

export default async function AdminShopSettingsPage() {
  const settings = await prisma.shopSettings.findUnique({
    where: { id: SHOP_SETTINGS_ID },
  });

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/shop"
          className="text-sm text-neutral-400 hover:underline"
        >
          ← Shop
        </Link>
      </div>
      <h1 className="mb-6 text-xl font-semibold text-white">
        Shop page settings
      </h1>
      <ShopSettingsForm
        initialTitle={settings?.title ?? null}
        initialDescription={settings?.description ?? null}
      />
    </>
  );
}
