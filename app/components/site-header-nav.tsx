"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

export function SiteHeaderNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue/80 focus-visible:ring-offset-2 ${
              active
                ? "bg-mkp-blue/10 text-mkp-blue-dark"
                : "text-mkp-ink hover:bg-mkp-surface-subtle hover:text-mkp-blue"
            } `}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
