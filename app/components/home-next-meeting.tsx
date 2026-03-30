import Link from "next/link";
import { getMeetingTimeRangeLabel, site } from "@/lib/site-config";
import type { WeekIntentions } from "@/lib/intentions-store";
import { HomeNextMeetingRsvp } from "./home-next-meeting-rsvp";
import { LinkifyText } from "./linkify-text";

type NextMeeting = {
  key: string;
  label: string;
};

type Props = {
  nextMeeting: NextMeeting | null;
  snapshot: WeekIntentions | null;
};

function splitLabel(label: string): { weekday: string; dateRest: string } {
  const comma = label.indexOf(", ");
  if (comma === -1) {
    return { weekday: label, dateRest: "" };
  }
  return {
    weekday: label.slice(0, comma),
    dateRest: label.slice(comma + 2),
  };
}

export function HomeNextMeeting({ nextMeeting, snapshot }: Props) {
  if (!nextMeeting) {
    return (
      <section className="rounded-2xl border border-mkp-border bg-mkp-surface p-8 shadow-sm">
        <p className="text-mkp-muted">
          No upcoming meeting dates found. Check{" "}
          <code className="text-mkp-ink">meetingWeekday</code> in site config.
        </p>
      </section>
    );
  }

  const { weekday, dateRest } = splitLabel(nextMeeting.label);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-mkp-border bg-mkp-surface shadow-md ring-1 ring-mkp-navy/5"
      aria-labelledby="home-next-meeting-heading"
    >
      <div
        className="h-1.5 w-full bg-gradient-to-r from-mkp-gold via-mkp-blue to-mkp-navy"
        aria-hidden
      />
      <h2 id="home-next-meeting-heading" className="sr-only">
        Next meeting
      </h2>
      <div className="space-y-8 p-6 sm:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-mkp-blue">
            Next meeting
          </p>
          <p className="mt-2 text-3xl font-semibold leading-tight text-mkp-ink sm:text-4xl">
            {weekday}
          </p>
          <p className="mt-1 text-2xl font-medium text-mkp-muted sm:text-3xl">
            {dateRest}
          </p>
          <p className="mt-4 text-lg text-mkp-ink">
            {getMeetingTimeRangeLabel()}
          </p>
          <p className="mt-1 text-sm text-mkp-muted">{site.timezoneLabel}</p>
        </div>

        <div className="space-y-6 border-t border-mkp-border pt-8">
          {snapshot?.weekDescription ? (
            <div className="rounded-xl border border-mkp-border bg-mkp-surface-subtle p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-mkp-blue">
                This week
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-mkp-ink">
                <LinkifyText text={snapshot.weekDescription} />
              </p>
            </div>
          ) : null}

          <div className="rounded-xl border border-mkp-border bg-mkp-surface-subtle p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-mkp-muted">
              King this week
            </p>
            {snapshot?.king ? (
              <p className="mt-1 text-lg font-semibold text-mkp-blue">
                {snapshot.king.name}
              </p>
            ) : (
              <p className="mt-1 text-mkp-ink">
                <span className="font-medium">Open</span>
                <span className="text-mkp-muted">
                  {" "}
                  — volunteer on the{" "}
                  <Link
                    href="/king"
                    className="font-medium text-mkp-blue underline-offset-2 transition-colors hover:underline"
                  >
                    King signup
                  </Link>{" "}
                  page.
                </span>
              </p>
            )}
          </div>

          <HomeNextMeetingRsvp weekKey={nextMeeting.key} />

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/attendance"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-mkp-blue px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-mkp-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue focus-visible:ring-offset-2 active:translate-y-px"
            >
              Who’s coming — all weeks
            </Link>
            <Link
              href="/schedule"
              className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-mkp-border bg-mkp-surface px-5 py-3 text-center text-sm font-semibold text-mkp-ink shadow-sm transition-colors duration-200 hover:border-mkp-blue hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue/70 focus-visible:ring-offset-2 active:translate-y-px"
            >
              Schedule / RSVP
            </Link>
            <Link
              href="/king"
              className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-mkp-gold/70 bg-mkp-yellow-soft px-5 py-3 text-center text-sm font-semibold text-mkp-ink shadow-sm transition-colors duration-200 hover:border-mkp-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-gold focus-visible:ring-offset-2 active:translate-y-px"
            >
              King signup
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
