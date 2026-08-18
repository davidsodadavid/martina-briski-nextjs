"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "/admin", label: "Blog" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/practice", label: "Practice" },
  { href: "/admin/participants", label: "Participants" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/ebooks", label: "Free content" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/cv", label: "CV" },
];

const BG = "#5F6D6A";

function MessagesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

function MessagesLink({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = pathname.startsWith("/admin/messages");
  return (
    <Link
      href="/admin/messages"
      onClick={onNavigate}
      className={`mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <MessagesIcon className="h-4 w-4" />
      Messages
    </Link>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function OrdersLink({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = pathname.startsWith("/admin/orders");
  return (
    <Link
      href="/admin/orders"
      onClick={onNavigate}
      className={`mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <OrdersIcon className="h-4 w-4" />
      Orders
    </Link>
  );
}

function EventsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function EventsLink({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = pathname.startsWith("/admin/events");
  return (
    <Link
      href="/admin/events"
      onClick={onNavigate}
      className={`mb-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <EventsIcon className="h-4 w-4" />
      Events
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-between px-4 py-3 md:hidden"
        style={{ backgroundColor: BG }}
      >
        <Logo className="h-4 w-auto" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-1 text-white"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="flex h-full w-full flex-col p-6"
            style={{ backgroundColor: BG }}
          >
            <div className="mb-6 flex items-center justify-between">
              <Logo className="h-4 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1 text-white"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>
            <MessagesLink
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <OrdersLink
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <EventsLink
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <SidebarLinks
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      <aside
        className="hidden shrink-0 flex-col p-6 md:flex md:w-56"
        style={{ backgroundColor: BG }}
      >
        <Logo className="mb-6 h-4 w-auto" />
        <MessagesLink pathname={pathname} />
        <OrdersLink pathname={pathname} />
        <EventsLink pathname={pathname} />
        <SidebarLinks pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col justify-between">
      <div className="flex flex-col gap-1">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-4 rounded-md px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white"
        >
          View site
        </Link>
      </div>

      <button
        type="button"
        onClick={() => logout()}
        className="rounded-md px-3 py-2 text-left text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
      >
        Log out
      </button>
    </nav>
  );
}
