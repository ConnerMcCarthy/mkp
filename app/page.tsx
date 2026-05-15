import Link from "next/link";
import { HomeNextMeeting } from "./components/home-next-meeting";
import { getWeekSnapshot, readIntentions } from "@/lib/intentions-store";
import { getUpcomingMeetingDates } from "@/lib/meeting-weeks";
import { site } from "@/lib/site-config";

/** Next meeting date is computed from “today” — avoid a stale build-time snapshot. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const upcoming = getUpcomingMeetingDates(1);
  const nextMeeting = upcoming[0] ?? null;
  const data = await readIntentions();
  const snapshot = nextMeeting
    ? getWeekSnapshot(data, nextMeeting.key)
    : null;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 pb-14 sm:px-6">
      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-mkp-ink sm:text-4xl">
            {site.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-mkp-muted">
            A weekly support group for men.
          </p>
        </div>
        <div className="flex w-full flex-col flex-wrap gap-3 sm:flex-row sm:items-start sm:gap-3 lg:gap-4">
          <Link
            href="/messages"
            className="inline-flex min-h-[3.25rem] min-w-[8.5rem] flex-1 items-center justify-center rounded-xl bg-mkp-blue px-8 py-4 text-center text-base font-semibold text-white shadow-md shadow-mkp-navy/10 transition-colors duration-200 hover:bg-mkp-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue focus-visible:ring-offset-2 active:translate-y-px sm:min-h-[3.5rem] sm:min-w-[8.5rem] sm:flex-initial sm:px-8 sm:py-4 sm:text-lg"
          >
            Forum
          </Link>
          <Link
            href="/schedule"
            className="inline-flex min-h-[3.25rem] min-w-[8.5rem] flex-1 items-center justify-center rounded-xl border-2 border-mkp-border bg-mkp-surface px-8 py-4 text-center text-base font-semibold text-mkp-ink shadow-sm transition-colors duration-200 hover:border-mkp-blue hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue/70 focus-visible:ring-offset-2 active:translate-y-px sm:min-h-[3.5rem] sm:min-w-[8.5rem] sm:flex-initial sm:px-8 sm:py-4 sm:text-lg"
          >
            Schedule
          </Link>
          <Link
            href="/king"
            className="inline-flex min-h-[3.25rem] min-w-[8.5rem] flex-1 items-center justify-center rounded-xl border-2 border-mkp-gold/70 bg-mkp-yellow-soft px-8 py-4 text-center text-base font-semibold text-mkp-ink shadow-sm transition-colors duration-200 hover:border-mkp-gold hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-gold focus-visible:ring-offset-2 active:translate-y-px sm:min-h-[3.5rem] sm:min-w-[8.5rem] sm:flex-initial sm:px-8 sm:py-4 sm:text-lg"
          >
            King
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <HomeNextMeeting nextMeeting={nextMeeting} snapshot={snapshot} />
      </div>

      <section
        className="mt-12 rounded-xl border border-mkp-border border-l-4 border-l-mkp-gold bg-mkp-surface p-6 shadow-sm ring-1 ring-mkp-border/40"
        aria-labelledby="quick-facts-heading"
      >
        <h2
          id="quick-facts-heading"
          className="text-sm font-semibold uppercase tracking-wide text-mkp-blue-dark"
        >
          Quick facts
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2.5 marker:text-mkp-blue text-mkp-ink">
          <li>Open to new men; ask about expectations in advance.</li>
          <li>Join the Google Group for announcements (see Resources).</li>
          <li>
            King training signup:{" "}
            <Link
              href={site.links.kingSignup}
              className="font-medium text-mkp-blue underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MKP USA
            </Link>
            .
          </li>
        </ul>
      </section>
    </main>
  );
}
