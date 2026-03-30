import Link from "next/link";
import { FooterSiteQr } from "./footer-site-qr";
import { site } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-mkp-border bg-mkp-surface px-4 py-10 sm:px-6">
      <div
        className="mx-auto mb-6 h-px max-w-3xl bg-gradient-to-r from-transparent via-mkp-gold/50 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-5 text-sm text-mkp-muted">
        <p>
          <Link
            href={site.links.mkpUsa}
            className="font-medium text-mkp-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.org}
          </Link>
          — men’s work, community, and growth.
        </p>
        <p className="text-xs leading-relaxed">
          This site is for local circle logistics only. For trainings, policy,
          and official programs, use{" "}
          <Link
            href={site.links.mkpUsa}
            className="text-mkp-ink underline hover:text-mkp-blue"
            target="_blank"
            rel="noopener noreferrer"
          >
            mankindproject.org
          </Link>
          .
        </p>
        <FooterSiteQr />
      </div>
    </footer>
  );
}
