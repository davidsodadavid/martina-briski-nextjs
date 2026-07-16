export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-1" style={{ backgroundColor: "#5F6D6A" }}>
      {children}
    </div>
  );
}
