import type { Metadata } from "next";
import Link from "next/link";
import { getWeekSnapshot, readIntentions } from "@/lib/intentions-store";
import { getUpcomingMeetingDates } from "@/lib/meeting-weeks";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Who’s coming",
  description: `RSVP and King for upcoming ${site.name} meetings.`,
};

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const meetings = getUpcomingMeetingDates(8);
  const data = await readIntentions();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-mkp-blue">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Who’s coming
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-mkp-ink">
        Who’s coming
      </h1>
      <p className="mt-3 max-w-2xl text-mkp-muted">
        Public list of intentions and Kings for upcoming circle nights. Add or
        change yours on the{" "}
        <Link href="/schedule" className="text-mkp-blue hover:underline">
          Schedule
        </Link>{" "}
        page.
      </p>

      <div className="mt-10 space-y-8">
        {meetings.length === 0 ? (
          <p className="text-sm text-mkp-muted">No meeting dates configured.</p>
        ) : (
          meetings.map((m) => {
            const snapshot = getWeekSnapshot(data, m.key);
            const yes = snapshot.rsvps.filter((r) => r.status === "yes");
            const no = snapshot.rsvps.filter((r) => r.status === "no");

            return (
              <article
                key={m.key}
                className="rounded-2xl border border-mkp-border bg-mkp-surface p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-xl font-semibold text-mkp-ink">
                  {m.label}
                </h2>

                <div className="mt-6 rounded-xl border border-mkp-yellow/50 bg-mkp-yellow-soft/60 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-mkp-yellow">
                    King this week
                  </p>
                  {snapshot.king ? (
                    <p className="mt-2 text-xl font-semibold text-mkp-ink">
                      {snapshot.king.name}
                    </p>
                  ) : (
                    <p className="mt-2 text-mkp-ink">
                      <span className="font-medium">Open</span>
                      <span className="text-mkp-muted">
                        {" "}
                        — slot on the Schedule page
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-mkp-blue">
                      Planning to attend ({yes.length})
                    </h3>
                    {yes.length === 0 ? (
                      <p className="mt-3 text-sm text-mkp-muted">No one yet.</p>
                    ) : (
                      <ul className="mt-3 list-inside list-disc space-y-1.5 text-mkp-ink">
                        {yes.map((r) => (
                          <li key={r.name}>{r.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-mkp-muted">
                      Not this week ({no.length})
                    </h3>
                    {no.length === 0 ? (
                      <p className="mt-3 text-sm text-mkp-muted">—</p>
                    ) : (
                      <ul className="mt-3 list-inside list-disc space-y-1.5 text-mkp-muted">
                        {no.map((r) => (
                          <li key={r.name}>{r.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
