import type { Metadata } from "next";
import Link from "next/link";
import { ContactQr } from "../components/contact-qr";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${site.name} stewards and newcomers’ path.`,
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 pb-14 sm:px-6">
      <p className="text-sm font-medium text-mkp-blue">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Contact
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-mkp-ink">
        Contact &amp; newcomer flow
      </h1>
      <p className="mt-3 max-w-2xl text-mkp-muted">
        Use this page in the room: QR on a handout, or share the URL after the
        meeting—so interested men can reach you without interrupting the
        circle.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:items-start">
        <section aria-labelledby="steward-heading">
          <h2
            id="steward-heading"
            className="text-lg font-semibold text-mkp-ink"
          >
            Circle contacts
          </h2>
          <p className="mt-3 text-mkp-ink">{site.contacts.stewardName}</p>
          <p className="mt-2">
            <a
              href={`mailto:${site.contacts.circleEmail}`}
              className="font-medium text-mkp-blue hover:underline"
            >
              {site.contacts.circleEmail}
            </a>
          </p>
          {site.contacts.stewardPhone ? (
            <p className="mt-2 text-sm text-mkp-muted">
              Phone: {site.contacts.stewardPhone}
            </p>
          ) : null}
          <p className="mt-4 text-sm text-mkp-muted">
            Edit names and email in{" "}
            <code className="rounded bg-mkp-surface-subtle px-1.5 py-0.5 text-mkp-ink">
              lib/site-config.ts
            </code>
            .
          </p>
        </section>

        <section
          className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-sm"
          aria-labelledby="qr-heading"
        >
          <h2 id="qr-heading" className="text-lg font-semibold text-mkp-ink">
            QR to this page
          </h2>
          <p className="mt-2 text-sm text-mkp-muted">
            Printed sheets or slides can point here for “learn more.”
          </p>
          <div className="mt-6 flex justify-center">
            <ContactQr />
          </div>
        </section>
      </div>

      <section
        className="mt-12 rounded-xl border border-mkp-border border-dashed bg-mkp-yellow-soft/50 p-6"
        aria-labelledby="flow-heading"
      >
        <h2 id="flow-heading" className="text-lg font-semibold text-mkp-ink">
          Newcomer flow (framework)
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-mkp-ink">
          <li>First touch: this page or steward email.</li>
          <li>
            Orientation: welcome PDF + expectations (see{" "}
            <Link href="/resources" className="text-mkp-blue hover:underline">
              Resources
            </Link>
            ).
          </li>
          <li>
            Want to speak without your name on it?{" "}
            <Link href="/messages" className="text-mkp-blue hover:underline">
              Anonymous messages
            </Link>{" "}
            — public to the group, author not shown.
          </li>
          <li>
            Ongoing: Google Group + RSVP on the Schedule page when needed.
          </li>
        </ol>
      </section>
    </main>
  );
}
