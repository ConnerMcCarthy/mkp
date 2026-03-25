import Link from "next/link";
import { getMeetingTimeRangeLabel, site } from "@/lib/site-config";
import type { WeekIntentions } from "@/lib/intentions-store";

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
      className="overflow-hidden rounded-2xl border border-mkp-border bg-mkp-surface shadow-sm"
      aria-labelledby="home-next-meeting-heading"
    >
      <h2 id="home-next-meeting-heading" className="sr-only">
        Next meeting
      </h2>
      <div className="grid gap-8 p-6 sm:grid-cols-2 sm:gap-10 sm:p-10">
        <div className="flex flex-col justify-center border-b border-mkp-border pb-8 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-10">
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

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-mkp-ink">King this week</p>
            <p className="mt-1 text-sm text-mkp-muted">
              Who&apos;s planning to attend is on{" "}
              <Link href="/attendance" className="text-mkp-blue hover:underline">
                Who’s coming
              </Link>
              . Set your intention or sign up on the{" "}
              <Link href="/schedule" className="text-mkp-blue hover:underline">
                Schedule
              </Link>
              .
            </p>
          </div>

          <div className="rounded-xl border border-mkp-border bg-mkp-surface-subtle p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-mkp-muted">
              King
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
                  — volunteer on the Schedule page.
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/attendance"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-mkp-blue px-5 py-3 text-center text-sm font-semibold text-white hover:bg-mkp-blue-dark"
            >
              Who’s coming — all weeks
            </Link>
            <Link
              href="/schedule"
              className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-mkp-border bg-mkp-surface px-5 py-3 text-center text-sm font-semibold text-mkp-ink hover:border-mkp-blue"
            >
              Set intention &amp; King
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
