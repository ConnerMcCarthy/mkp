"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  submitKingClaim,
  submitKingRelease,
  submitWeekDescription,
  type FormState,
} from "@/app/actions/intentions";
import { LinkifyText } from "@/app/components/linkify-text";
import { MAX_WEEK_DESCRIPTION_LENGTH } from "@/lib/intentions-constants";
import type { WeekIntentions } from "@/lib/intentions-store";
import { MeetingWeekCalendar } from "../schedule/meeting-week-calendar";

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

export function KingSignup({
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

  const [kingState, kingAction, kingPending] = useActionState(
    submitKingClaim,
    initialFormState,
  );
  const [releaseState, releaseAction, releasePending] = useActionState(
    submitKingRelease,
    initialFormState,
  );
  const [weekDescState, weekDescAction, weekDescPending] = useActionState(
    submitWeekDescription,
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
        aria-labelledby="king-heading"
      >
        <h2 id="king-heading" className="text-lg font-semibold text-mkp-ink">
          King / leader for the week
        </h2>
        <p className="mt-2 text-sm text-mkp-muted">
          One brother volunteers as King for that evening. Pick the week on the
          calendar or from the list, then sign up. When someone claims the slot,
          it closes and their name is public on{" "}
          <Link href="/attendance" className="text-mkp-blue hover:underline">
            Who’s coming
          </Link>
          . RSVP without King signup stays on the{" "}
          <Link href="/schedule" className="text-mkp-blue hover:underline">
            Schedule
          </Link>{" "}
          page.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <MeetingWeekCalendar
            meetings={options}
            selectedWeekKey={selectedWeekKey}
            onSelectWeek={setSelectedWeekKey}
            embedded
          />

          <div className="space-y-6 lg:pt-1">
            <form
              key={`week-desc-${selectedWeekKey}`}
              action={weekDescAction}
              className="space-y-3 rounded-xl border border-mkp-border bg-mkp-surface-subtle p-4"
            >
              <div>
                <h3 className="text-sm font-semibold text-mkp-ink">
                  This week at a glance
                </h3>
                <p className="mt-1 text-xs text-mkp-muted">
                  Optional short note about what this evening might focus on
                  (theme, exercise, visitor welcome). Shown on Home and Who’s
                  coming for this date.
                </p>
              </div>
              <input type="hidden" name="weekKey" value={selectedWeekKey} />
              <div>
                <label htmlFor="week-description" className="sr-only">
                  Week description
                </label>
                <textarea
                  id="week-description"
                  name="description"
                  rows={3}
                  maxLength={MAX_WEEK_DESCRIPTION_LENGTH}
                  defaultValue={
                    intentionsByWeek[selectedWeekKey]?.weekDescription ?? ""
                  }
                  className="w-full rounded-lg border border-mkp-border bg-mkp-surface px-3 py-2 text-sm text-mkp-ink outline-none focus:border-mkp-blue focus:ring-1 focus:ring-mkp-blue"
                  placeholder="e.g. Check-in on boundaries; visitor in the room."
                />
                <p className="mt-1 text-xs text-mkp-muted">
                  Up to {MAX_WEEK_DESCRIPTION_LENGTH} characters. Leave blank
                  and save to clear.
                </p>
              </div>
              <button
                type="submit"
                disabled={weekDescPending}
                className="rounded-lg border border-mkp-border bg-mkp-surface px-4 py-2 text-sm font-medium text-mkp-ink hover:border-mkp-blue disabled:opacity-60"
              >
                {weekDescPending ? "Saving…" : "Save week note"}
              </button>
              <Message state={weekDescState} />
            </form>

            {kingForSelected ? (
              <div className="rounded-xl border border-mkp-yellow/70 bg-mkp-yellow-soft px-4 py-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-mkp-yellow">
                    Slot filled
                  </span>
                  <span className="min-w-0 text-xl font-semibold text-mkp-ink break-words">
                    {kingForSelected.name}
                  </span>
                </div>
                <p className="mt-3 text-sm text-mkp-muted">
                  King for the week you have selected. Pick another date on the
                  calendar to sign up for a different night, or ask a steward to
                  clear the slot.
                </p>
              </div>
            ) : (
              <form action={kingAction} className="space-y-4">
                <div>
                  <label
                    htmlFor="king-week"
                    className="block text-sm font-medium text-mkp-ink"
                  >
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
                  <label
                    htmlFor="king-name"
                    className="block text-sm font-medium text-mkp-ink"
                  >
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
          </div>
        </div>

        {showStewardRelease ? (
          <form
            action={releaseAction}
            className="mt-8 border-t border-mkp-border pt-6"
          >
            <h3 className="text-sm font-semibold text-mkp-ink">
              Stewards: clear King slot
            </h3>
            <p className="mt-1 text-xs text-mkp-muted">
              Uses <code className="text-mkp-ink">STEWARD_SECRET</code> from the
              server environment.
            </p>
            <div className="mt-3">
              <label
                htmlFor="release-week"
                className="block text-sm font-medium text-mkp-ink"
              >
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
              <label
                htmlFor="steward-secret"
                className="block text-sm font-medium text-mkp-ink"
              >
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

      <section aria-labelledby="king-summary-heading">
        <h2
          id="king-summary-heading"
          className="text-lg font-semibold text-mkp-ink"
        >
          Upcoming weeks
        </h2>
        <p className="mt-1 text-sm text-mkp-muted">
          King for each night below. RSVP:{" "}
          <Link href="/schedule" className="text-mkp-blue hover:underline">
            Schedule
          </Link>
          . Lists:{" "}
          <Link href="/attendance" className="text-mkp-blue hover:underline">
            Who’s coming
          </Link>
          .
        </p>
        <UpcomingWeeksTable
          meetings={options}
          intentionsByWeek={intentionsByWeek}
        />
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
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-mkp-border bg-mkp-surface text-xs font-semibold uppercase tracking-wide text-mkp-muted">
            <th className="px-4 py-3">Meeting</th>
            <th className="px-4 py-3">King</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => {
            const snapshot = intentionsByWeek[m.key] ?? {
              rsvps: [],
              king: null,
            };
            return (
              <tr
                key={m.key}
                className="border-b border-mkp-border/80 last:border-b-0 align-top"
              >
                <td className="px-4 py-3 font-medium text-mkp-ink">
                  <span>{m.label}</span>
                  {snapshot.weekDescription ? (
                    <p className="mt-1 whitespace-pre-wrap text-xs font-normal text-mkp-muted">
                      <LinkifyText text={snapshot.weekDescription} />
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-mkp-ink">
                  {snapshot.king ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex shrink-0 rounded-full bg-mkp-yellow-soft px-2 py-0.5 text-xs font-semibold text-mkp-yellow">
                        Filled
                      </span>
                      <span className="min-w-0 font-semibold text-mkp-blue break-words">
                        {snapshot.king.name}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium text-mkp-muted">Open</span>
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
