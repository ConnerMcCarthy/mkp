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
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="border-l-4 border-mkp-yellow bg-mkp-yellow-soft px-4 py-3 text-sm text-mkp-ink">
        <strong className="text-mkp-yellow">{site.org}</strong>
        <span className="text-mkp-muted"> — local circle hub</span>
      </div>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-mkp-ink sm:text-4xl">
        {site.name}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-mkp-muted">{site.tagline}</p>

      <div className="mt-10">
        <HomeNextMeeting nextMeeting={nextMeeting} snapshot={snapshot} />
      </div>

      <section
        className="mt-12 rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-sm"
        aria-labelledby="quick-facts-heading"
      >
        <h2
          id="quick-facts-heading"
          className="text-sm font-semibold uppercase tracking-wide text-mkp-muted"
        >
          Quick facts
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-mkp-ink">
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

      <section className="mt-14" aria-labelledby="needs-heading">
        <h2
          id="needs-heading"
          className="text-xl font-semibold text-mkp-ink"
        >
          Needs &amp; challenges
        </h2>
        <p className="mt-2 text-sm text-mkp-muted">
          What we&apos;re solving for as this site grows.
        </p>
        <ul className="mt-6 space-y-4 border-t border-mkp-border pt-6 text-mkp-ink">
          <li>
            <span className="font-medium text-mkp-blue">New people</span>
            <span className="text-mkp-muted">
              {" "}
              — clear first visit info, consent to contact, gentle onboarding.
            </span>
          </li>
          <li>
            <span className="font-medium text-mkp-blue">Communications</span>
            <span className="text-mkp-muted">
              {" "}
              — Google Group rhythm, shared PDFs, tiered importance in email.
            </span>
          </li>
          <li>
            <span className="font-medium text-mkp-blue">
              Visitors in the room
            </span>
            <span className="text-mkp-muted">
              {" "}
              — way to learn more without derailing the circle (QR → contact /
              flow).
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="solutions-heading">
        <h2
          id="solutions-heading"
          className="text-xl font-semibold text-mkp-ink"
        >
          Planned solutions
        </h2>
        <p className="mt-2 text-sm text-mkp-muted">
          Roadmap items to implement over time (not all live yet).
        </p>
        <ul className="mt-6 space-y-3 border-t border-mkp-border pt-6">
          {[
            "Automated email via Google Groups with urgency tiers.",
            "Attendance & intention: public Who’s coming page + Schedule signup.",
            "Anonymous channel: public board on the Messages page (no name on posts).",
            "King signup reminders with clear links and dates.",
            "Polls and optional member login when the circle is ready.",
          ].map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-lg border border-mkp-border bg-mkp-surface px-4 py-3 text-sm text-mkp-ink"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mkp-yellow"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
