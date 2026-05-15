"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { submitIntention, type FormState } from "@/app/actions/intentions";
import { LinkifyText } from "@/app/components/linkify-text";
import type { WeekIntentions } from "@/lib/intentions-store";
import { MeetingWeekCalendar } from "./meeting-week-calendar";

type MeetingOption = { key: string; label: string };

type Props = {
  meetings: MeetingOption[];
  intentionsByWeek: Record<string, WeekIntentions>;
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
}: Props) {
  const defaultWeek = meetings[0]?.key ?? "";
  const [selectedWeekKey, setSelectedWeekKey] = useState(defaultWeek);
  const [intentionChoice, setIntentionChoice] = useState<"yes" | "no" | null>(
    null,
  );
  const [intentionChoiceTouched, setIntentionChoiceTouched] = useState(false);

  useEffect(() => {
    if (meetings.length === 0) return;
    const ok = meetings.some((m) => m.key === selectedWeekKey);
    if (!ok) setSelectedWeekKey(meetings[0].key);
  }, [meetings, selectedWeekKey]);

  useEffect(() => {
    setIntentionChoice(null);
    setIntentionChoiceTouched(false);
  }, [selectedWeekKey]);

  const [intentionState, intentionAction, intentionPending] = useActionState(
    submitIntention,
    initialFormState,
  );

  useEffect(() => {
    if (intentionState?.ok) {
      setIntentionChoice(null);
      setIntentionChoiceTouched(false);
    }
  }, [intentionState]);

  const options = useMemo(() => meetings, [meetings]);

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

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <MeetingWeekCalendar
            meetings={options}
            selectedWeekKey={selectedWeekKey}
            onSelectWeek={setSelectedWeekKey}
            embedded
          />

          <form
            action={intentionAction}
            className="space-y-4 lg:pt-1"
            onSubmit={(e) => {
              if (!intentionChoice) {
                e.preventDefault();
                setIntentionChoiceTouched(true);
              }
            }}
          >
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
            <div>
              <p
                className="text-sm font-medium text-mkp-ink"
                id="intention-status-label"
              >
                Are you planning to attend?
              </p>
              <input type="hidden" name="status" value={intentionChoice ?? ""} />
              <div
                className="mt-3 grid gap-3 sm:grid-cols-2"
                role="group"
                aria-labelledby="intention-status-label"
              >
                <button
                  type="button"
                  aria-pressed={intentionChoice === "yes"}
                  aria-label="Yes, I’m planning to attend this meeting"
                  onClick={() => {
                    setIntentionChoice("yes");
                    setIntentionChoiceTouched(false);
                  }}
                  className={`min-h-[3.75rem] rounded-xl border-2 px-3 py-4 text-center text-sm font-semibold leading-snug transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue focus-visible:ring-offset-2 ${
                    intentionChoice === "yes"
                      ? "border-green-600 bg-green-100 text-green-950 shadow-sm ring-2 ring-green-600 ring-offset-2 ring-offset-mkp-surface"
                      : "border-mkp-border bg-mkp-surface text-mkp-ink shadow-sm hover:border-green-500/70 hover:bg-green-50/50"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  aria-pressed={intentionChoice === "no"}
                  aria-label="No, not attending this meeting week"
                  onClick={() => {
                    setIntentionChoice("no");
                    setIntentionChoiceTouched(false);
                  }}
                  className={`min-h-[3.75rem] rounded-xl border-2 px-3 py-4 text-center text-sm font-semibold leading-snug transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mkp-blue focus-visible:ring-offset-2 ${
                    intentionChoice === "no"
                      ? "border-red-600 bg-red-100 text-red-950 shadow-sm ring-2 ring-red-600 ring-offset-2 ring-offset-mkp-surface"
                      : "border-mkp-border bg-mkp-surface text-mkp-ink shadow-sm hover:border-red-500/70 hover:bg-red-50/50"
                  }`}
                >
                  No
                </button>
              </div>
              {intentionChoiceTouched && !intentionChoice ? (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  Tap <strong className="font-medium">Yes</strong> or{" "}
                  <strong className="font-medium">No</strong> before saving.
                </p>
              ) : null}
            </div>
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

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-lg font-semibold text-mkp-ink">
          Upcoming weeks
        </h2>
        <p className="mt-1 text-sm text-mkp-muted">
          King for each night below — sign up on{" "}
          <Link href="/king" className="text-mkp-blue hover:underline">
            King signup
          </Link>
          . RSVP lists:{" "}
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
