import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Resources",
  description: `Documents and links for ${site.name}.`,
};

export default function ResourcesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-mkp-blue">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Resources
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-mkp-ink">
        Resources
      </h1>
      <p className="mt-3 max-w-2xl text-mkp-muted">
        Central place for the Google Group, PDFs, and official MKP links.
        Update URLs in{" "}
        <code className="rounded bg-mkp-surface-subtle px-1.5 py-0.5 text-mkp-ink">
          lib/site-config.ts
        </code>
        .
      </p>

      <ul className="mt-10 space-y-4">
        <li className="rounded-xl border border-mkp-border bg-mkp-surface p-5 shadow-sm">
          <h2 className="font-semibold text-mkp-ink">Google Group</h2>
          <p className="mt-2 text-sm text-mkp-muted">
            Announcements, attachments, and email preferences. Wire your real
            group URL here.
          </p>
          <a
            href={site.links.googleGroup}
            className="mt-3 inline-block text-sm font-medium text-mkp-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Google Group →
          </a>
        </li>
        <li className="rounded-xl border border-mkp-border bg-mkp-surface p-5 shadow-sm">
          <h2 className="font-semibold text-mkp-ink">Welcome PDF (example)</h2>
          <p className="mt-2 text-sm text-mkp-muted">
            Link to Drive/Dropbox or hosted PDF for newcomers.
          </p>
          <a
            href={site.links.pdfWelcome}
            className="mt-3 inline-block text-sm font-medium text-mkp-blue hover:underline"
          >
            Download / view PDF →
          </a>
        </li>
        <li className="rounded-xl border border-mkp-border bg-mkp-surface p-5 shadow-sm">
          <h2 className="font-semibold text-mkp-ink">King &amp; trainings</h2>
          <p className="mt-2 text-sm text-mkp-muted">
            Official signup paths through Mankind Project USA.
          </p>
          <a
            href={site.links.kingSignup}
            className="mt-3 inline-block text-sm font-medium text-mkp-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit MKP USA →
          </a>
        </li>
      </ul>
    </main>
  );
}
