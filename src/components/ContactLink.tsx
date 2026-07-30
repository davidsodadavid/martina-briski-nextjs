"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MailIcon from "@/components/MailIcon";

export default function ContactLink({ className }: { className?: string }) {
  const pathname = usePathname();
  const onContactPage = pathname === "/contact";

  if (onContactPage) {
    return (
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className={className}
      >
        <MailIcon className="h-[18px] w-[18px]" />
      </button>
    );
  }

  return (
    <Link href="/contact" aria-label="Contact" className={className}>
      <MailIcon className="h-[18px] w-[18px]" />
    </Link>
  );
}
