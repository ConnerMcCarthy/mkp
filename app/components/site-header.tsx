import Link from "next/link";
import { site } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/messages", label: "Messages" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-mkp-border bg-mkp-surface">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="group block shrink-0">
          <p className="text-xs font-medium uppercase tracking-wider text-mkp-muted">
            {site.org}
          </p>
          <p className="text-lg font-semibold text-mkp-ink group-hover:text-mkp-blue-dark">
            {site.name}
          </p>
        </Link>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium"
          aria-label="Main"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-mkp-ink underline-offset-4 hover:text-mkp-blue hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
