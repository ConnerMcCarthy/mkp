import {
  getMeetingTimeRangeLabel,
  getMeetingWeekdayLabel,
  site,
} from "@/lib/site-config";

export function NextMeetingCard() {
  const day = getMeetingWeekdayLabel();
  return (
    <section
      className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-sm"
      aria-labelledby="next-meeting-heading"
    >
      <h2
        id="next-meeting-heading"
        className="text-sm font-semibold uppercase tracking-wide text-mkp-muted"
      >
        Typical week
      </h2>
      <p className="mt-2 text-xl font-semibold text-mkp-ink">
        {day}s · {getMeetingTimeRangeLabel()}
      </p>
      <p className="mt-1 text-sm text-mkp-muted">{site.timezoneLabel}</p>
      <p className="mt-4 text-mkp-ink">{site.meetingLocation}</p>
      <p className="mt-2 text-sm text-mkp-muted">
        {site.meetingLocationNote}
      </p>
    </section>
  );
}
