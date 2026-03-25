"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  submitIntention,
  submitKingClaim,
  submitKingRelease,
  type FormState,
} from "@/app/actions/intentions";
import type { WeekIntentions } from "@/lib/intentions-store";
import { MeetingWeekCalendar } from "./meeting-week-calendar";

type MeetingOption = { key: string; label: string };

type Props = {
  meetings: MeetingOption[];
  intentionsByWeek: Record<string, WeekIntentions>;
  showStewardRelease: boolean;
};

const initialFormState: FormState | undefined = undefined;

function Message({ state }: { state: FormState | undefined }) {
  if (!state) return null;
  if (state.ok) {
    return state.message ? (
      <p className="mt-2 text-sm text-mkp-blue" role="status">
        {state.message}
      </p>
    ) : (
      <p className="mt-2 text-sm text-mkp-blue" role="status">
        Saved.
      </p>
    );
  }
  return (
    <p className="mt-2 text-sm text-red-700" role="alert">
      {state.error}
    </p>
  );
}

export function ScheduleIntentions({
  meetings,
  intentionsByWeek,
  showStewardRelease,
}: Props) {
  const defaultWeek = meetings[0]?.key ?? "";
  const [selectedWeekKey, setSelectedWeekKey] = useState(defaultWeek);

  useEffect(() => {
    if (meetings.length === 0) return;
    const ok = meetings.some((m) => m.key === selectedWeekKey);
    if (!ok) setSelectedWeekKey(meetings[0].key);
  }, [meetings, selectedWeekKey]);

  const [intentionState, intentionAction, intentionPending] = useActionState(
    submitIntention,
    initialFormState,
  );
  const [kingState, kingAction, kingPending] = useActionState(
    submitKingClaim,
    initialFormState,
  );
  const [releaseState, releaseAction, releasePending] = useActionState(
    submitKingRelease,
    initialFormState,
  );

  const options = useMemo(() => meetings, [meetings]);
  const kingForSelected =
    intentionsByWeek[selectedWeekKey]?.king ?? null;

  if (options.length === 0) {
    return (
      <p className="text-sm text-mkp-muted">
        No upcoming meetings found. Check `meetingWeekday` in site config.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <section
        className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-sm sm:p-8"
        aria-labelledby="intention-calendar-heading"
      >
        <h2
          id="intention-calendar-heading"
          className="text-lg font-semibold text-mkp-ink"
        >
          Pick a week &amp; set your intention
        </h2>
        <p className="mt-2 text-sm text-mkp-muted">
          Choose the meeting on the calendar or from the list, then say whether
          you&apos;ll be there. Use the name men will recognize — your latest
          answer replaces the last one for that week.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <MeetingWeekCalendar
            meetings={options}
            selectedWeekKey={selectedWeekKey}
            onSelectWeek={setSelectedWeekKey}
            embedded
          />

          <form action={intentionAction} className="space-y-4 lg:pt-1">
            <div>
              <label htmlFor="intention-week" className="block text-sm font-medium text-mkp-ink">
                Meeting
              </label>
              <select
                id="intention-week"
                name="weekKey"
                required
                value={selectedWeekKey}
                onChange={(e) => setSelectedWeekKey(e.target.value)}
                className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
              >
                {options.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="intention-name" className="block text-sm font-medium text-mkp-ink">
                Your name
              </label>
              <input
                id="intention-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                maxLength={80}
                className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
                placeholder="First name or how you go in circle"
              />
            </div>
            <fieldset>
              <legend className="text-sm font-medium text-mkp-ink">
                Are you planning to attend?
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    id="intention-status-yes"
                    type="radio"
                    name="status"
                    value="yes"
                    required
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="intention-status-yes"
                    className="flex min-h-[3.25rem] cursor-pointer items-center justify-center rounded-xl border-2 border-mkp-border bg-mkp-surface px-4 py-4 text-center text-sm font-semibold leading-snug text-mkp-ink shadow-sm transition-colors hover:border-green-500/60 hover:bg-green-50/40 peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-900 peer-focus-visible:ring-2 peer-focus-visible:ring-mkp-blue peer-focus-visible:ring-offset-2"
                  >
                    Yes, I’m planning to be there
                  </label>
                </div>
                <div>
                  <input
                    id="intention-status-no"
                    type="radio"
                    name="status"
                    value="no"
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="intention-status-no"
                    className="flex min-h-[3.25rem] cursor-pointer items-center justify-center rounded-xl border-2 border-mkp-border bg-mkp-surface px-4 py-4 text-center text-sm font-semibold leading-snug text-mkp-ink shadow-sm transition-colors hover:border-red-500/60 hover:bg-red-50/40 peer-checked:border-red-600 peer-checked:bg-red-50 peer-checked:text-red-900 peer-focus-visible:ring-2 peer-focus-visible:ring-mkp-blue peer-focus-visible:ring-offset-2"
                  >
                    No, not this week
                  </label>
                </div>
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={intentionPending}
              className="rounded-lg bg-mkp-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-mkp-blue-dark disabled:opacity-60"
            >
              {intentionPending ? "Saving…" : "Save intention"}
            </button>
            <Message state={intentionState} />
          </form>
        </div>
      </section>

      <section
        className="rounded-xl border border-mkp-border bg-mkp-surface p-6 shadow-sm"
        aria-labelledby="king-heading"
      >
        <h2 id="king-heading" className="text-lg font-semibold text-mkp-ink">
          King / leader for the week
        </h2>
        <p className="mt-2 text-sm text-mkp-muted">
          One brother volunteers as King for that evening. When someone signs
          up, the slot closes and their name is public on{" "}
          <Link href="/attendance" className="text-mkp-blue hover:underline">
            Who’s coming
          </Link>
          .
        </p>

        {kingForSelected ? (
          <div className="mt-6 rounded-xl border border-mkp-yellow/70 bg-mkp-yellow-soft px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-mkp-yellow">
              Slot filled
            </p>
            <p className="mt-2 text-xl font-semibold text-mkp-ink">
              {kingForSelected.name}
            </p>
            <p className="mt-2 text-sm text-mkp-muted">
              King for the meeting you have selected above. Choose another week
              to sign up, or ask a steward to clear the slot.
            </p>
          </div>
        ) : (
          <form action={kingAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="king-week" className="block text-sm font-medium text-mkp-ink">
                Meeting
              </label>
              <select
                id="king-week"
                name="weekKey"
                required
                value={selectedWeekKey}
                onChange={(e) => setSelectedWeekKey(e.target.value)}
                className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
              >
                {options.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="king-name" className="block text-sm font-medium text-mkp-ink">
                Your name
              </label>
              <input
                id="king-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                maxLength={80}
                className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
              />
            </div>
            <button
              type="submit"
              disabled={kingPending}
              className="rounded-lg border border-mkp-yellow bg-mkp-yellow-soft px-4 py-2.5 text-sm font-medium text-mkp-ink hover:bg-mkp-yellow-soft/80 disabled:opacity-60"
            >
              {kingPending ? "Saving…" : "Sign up as King this week"}
            </button>
            <Message state={kingState} />
          </form>
        )}

        {showStewardRelease ? (
          <form action={releaseAction} className="mt-8 border-t border-mkp-border pt-6">
            <h3 className="text-sm font-semibold text-mkp-ink">
              Stewards: clear King slot
            </h3>
            <p className="mt-1 text-xs text-mkp-muted">
              Uses <code className="text-mkp-ink">STEWARD_SECRET</code> from the
              server environment.
            </p>
            <div className="mt-3">
              <label htmlFor="release-week" className="block text-sm font-medium text-mkp-ink">
                Meeting
              </label>
              <select
                id="release-week"
                name="weekKey"
                required
                value={selectedWeekKey}
                onChange={(e) => setSelectedWeekKey(e.target.value)}
                className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink"
              >
                {options.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <label htmlFor="steward-secret" className="block text-sm font-medium text-mkp-ink">
                Steward password
              </label>
              <input
                id="steward-secret"
                name="secret"
                type="password"
                required
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-mkp-border bg-mkp-surface-subtle px-3 py-2 text-mkp-ink"
              />
            </div>
            <button
              type="submit"
              disabled={releasePending}
              className="mt-3 rounded-lg border border-mkp-border px-4 py-2 text-sm font-medium text-mkp-muted hover:bg-mkp-surface-subtle disabled:opacity-60"
            >
              {releasePending ? "Clearing…" : "Clear King for this week"}
            </button>
            <Message state={releaseState} />
          </form>
        ) : null}
      </section>

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-lg font-semibold text-mkp-ink">
          Upcoming weeks
        </h2>
        <p className="mt-1 text-sm text-mkp-muted">
          King names are public. Full Yes/No lists:{" "}
          <Link href="/attendance" className="text-mkp-blue hover:underline">
            Who’s coming
          </Link>
          .
        </p>
        <UpcomingWeeksTable meetings={options} intentionsByWeek={intentionsByWeek} />
      </section>
    </div>
  );
}

function UpcomingWeeksTable({
  meetings,
  intentionsByWeek,
}: {
  meetings: MeetingOption[];
  intentionsByWeek: Record<string, WeekIntentions>;
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-mkp-border bg-mkp-surface-subtle">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead>
          <tr className="border-b border-mkp-border bg-mkp-surface text-xs font-semibold uppercase tracking-wide text-mkp-muted">
            <th className="px-4 py-3">Meeting</th>
            <th className="px-4 py-3">King</th>
            <th className="px-4 py-3">Yes</th>
            <th className="px-4 py-3">No</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => {
            const snapshot = intentionsByWeek[m.key] ?? {
              rsvps: [],
              king: null,
            };
            const yesNames = snapshot.rsvps
              .filter((r) => r.status === "yes")
              .map((r) => r.name);
            const noNames = snapshot.rsvps
              .filter((r) => r.status === "no")
              .map((r) => r.name);
            return (
              <tr
                key={m.key}
                className="border-b border-mkp-border/80 last:border-b-0 align-top"
              >
                <td className="px-4 py-3 font-medium text-mkp-ink">{m.label}</td>
                <td className="px-4 py-3 align-top text-mkp-ink">
                  {snapshot.king ? (
                    <div>
                      <span className="inline-block rounded-full bg-mkp-yellow-soft px-2 py-0.5 text-xs font-semibold text-mkp-yellow">
                        Filled
                      </span>
                      <p className="mt-2 text-sm font-semibold text-mkp-blue">
                        {snapshot.king.name}
                      </p>
                    </div>
                  ) : (
                    <span className="font-medium text-mkp-muted">Open</span>
                  )}
                </td>
                <td className="px-4 py-3 text-mkp-ink">
                  {yesNames.length === 0 ? (
                    <span className="text-mkp-muted">—</span>
                  ) : (
                    <span>{yesNames.join(", ")}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-mkp-ink">
                  {noNames.length === 0 ? (
                    <span className="text-mkp-muted">—</span>
                  ) : (
                    <span>{noNames.join(", ")}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
