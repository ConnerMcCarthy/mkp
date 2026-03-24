import type { Metadata } from "next";
import Link from "next/link";
import { NextMeetingCard } from "../components/next-meeting-card";
import { ScheduleIntentions } from "./schedule-intentions";
import { getWeekSnapshot, readIntentions } from "@/lib/intentions-store";
import { getUpcomingMeetingDates } from "@/lib/meeting-weeks";
import { getMeetingWeekdayLabel, site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Schedule",
  description: `When and where ${site.name} meets.`,
};

/** Fresh intentions + RSVPs on each load */
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const day = getMeetingWeekdayLabel();
  const meetings = getUpcomingMeetingDates(8);
  const data = await readIntentions();
  const intentionsByWeek = Object.fromEntries(
    meetings.map((m) => [m.key, getWeekSnapshot(data, m.key)]),
  );
  const showStewardRelease = Boolean(process.env.STEWARD_SECRET);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-mkp-blue">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Schedule
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-mkp-ink">
        Schedule &amp; format
      </h1>
      <p className="mt-3 max-w-2xl text-mkp-muted">
        Replace placeholders below with your circle&apos;s open / closed weeks,
        holidays, and virtual links. Intention and King signup are stored on the
        server (see note below the forms).
      </p>

      <div className="mt-10">
        <NextMeetingCard />
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-mkp-ink">
          RSVP &amp; King for upcoming meetings
        </h2>
        <p className="max-w-2xl text-sm text-mkp-muted">
          Dates follow your circle night in{" "}
          <span className="text-mkp-ink">{site.timezone}</span>. Data lives in{" "}
          <code className="rounded bg-mkp-surface-subtle px-1 text-mkp-ink">
            data/intentions.json
          </code>{" "}
          on the server — fine for a VPS or local hosting; serverless hosts
          (e.g. Vercel) need a database or external sheet instead.
        </p>
        <ScheduleIntentions
          meetings={meetings}
          intentionsByWeek={intentionsByWeek}
          showStewardRelease={showStewardRelease}
        />
      </div>

      <section className="mt-14" aria-labelledby="format-heading">
        <h2 id="format-heading" className="text-lg font-semibold text-mkp-ink">
          Typical evening
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-mkp-ink">
          <li>Arrival and safety framing.</li>
          <li>Check-in round (timeboxed).</li>
          <li>Theme or exercise — update for your circle.</li>
          <li>Checkout and logistical announcements.</li>
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="exceptions-heading">
        <h2
          id="exceptions-heading"
          className="text-lg font-semibold text-mkp-ink"
        >
          Cancellations &amp; exceptions
        </h2>
        <p className="mt-3 text-sm text-mkp-muted">
          Add a short list (e.g. “No meeting Dec 24”) or embed a shared calendar
          here.
        </p>
        <ul className="mt-4 rounded-lg border border-dashed border-mkp-border bg-mkp-surface-subtle p-4 text-sm text-mkp-muted">
          <li>Example: {day} meetings follow federal holidays — TBD.</li>
        </ul>
      </section>
    </main>
  );
}
