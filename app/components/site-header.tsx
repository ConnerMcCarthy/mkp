import Link from "next/link";
import { SiteHeaderNav } from "./site-header-nav";
import { site } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Home" },
  { href: "/attendance", label: "Who’s coming" },
  { href: "/schedule", label: "Schedule" },
  { href: "/king", label: "King" },
  { href: "/messages", label: "Forum" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="w-full border-b border-mkp-border bg-mkp-surface shadow-sm shadow-mkp-navy/5">
      <div className="mx-auto flex w-full max-w-none flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <Link
          href="/"
          className="group block shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue/80 focus-visible:ring-offset-2"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-mkp-muted">
            {site.org}
          </p>
          <p className="font-mkp-heading text-lg font-semibold text-mkp-ink transition-colors group-hover:text-mkp-blue">
            {site.name}
          </p>
        </Link>
        <nav
          className="-mx-0.5 flex min-w-0 flex-1 flex-nowrap items-center justify-start gap-x-1 overflow-x-auto px-0.5 py-0.5 sm:justify-end sm:gap-x-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-mkp-border [&::-webkit-scrollbar-track]:bg-transparent"
          aria-label="Main"
        >
          <SiteHeaderNav items={nav} />
        </nav>
      </div>
    </header>
  );
}
