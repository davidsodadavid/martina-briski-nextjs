import AdminSidebar from "@/components/AdminSidebar";

// Admin pages must always show live data (and `next build` has no DB to
// prerender them against).
export const dynamic = "force-dynamic";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-1 flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div
          className="mx-auto w-full max-w-3xl"
          style={{ color: "var(--brand-text)" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
