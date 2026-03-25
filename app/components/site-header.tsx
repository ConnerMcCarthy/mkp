import Link from "next/link";
import { site } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Home" },
  { href: "/attendance", label: "Who’s coming" },
  { href: "/schedule", label: "Schedule" },
  { href: "/messages", label: "Anonymous messages" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="w-full border-b border-mkp-border bg-mkp-surface">
      <div className="mx-auto flex w-full max-w-none flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <Link href="/" className="group block shrink-0">
          <p className="text-xs font-medium uppercase tracking-wider text-mkp-muted">
            {site.org}
          </p>
          <p className="text-lg font-semibold text-mkp-ink group-hover:text-mkp-blue-dark">
            {site.name}
          </p>
        </Link>
        <nav
          className="-mx-1 flex min-w-0 flex-1 flex-nowrap items-center justify-start gap-x-4 overflow-x-auto px-1 py-0.5 text-sm font-medium sm:justify-end sm:gap-x-6 lg:gap-x-8 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-mkp-border [&::-webkit-scrollbar-track]:bg-transparent"
          aria-label="Main"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap text-mkp-ink underline-offset-4 hover:text-mkp-blue hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
