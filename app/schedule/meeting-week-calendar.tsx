"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type MeetingOption = { key: string; label: string };

type Props = {
  meetings: MeetingOption[];
  selectedWeekKey: string;
  onSelectWeek: (weekKey: string) => void;
  /** Softer frame when placed inside a larger card with the intention form */
  embedded?: boolean;
};

function parseKey(key: string): { y: number; m: number; d: number } {
  const [y, mo, d] = key.split("-").map(Number);
  return { y, m: mo - 1, d };
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function toKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function MeetingWeekCalendar({
  meetings,
  selectedWeekKey,
  onSelectWeek,
  embedded = false,
}: Props) {
  const keySet = useMemo(
    () => new Set(meetings.map((m) => m.key)),
    [meetings],
  );

  const bounds = useMemo(() => {
    if (meetings.length === 0) return null;
    const start = parseKey(meetings[0].key);
    const end = parseKey(meetings[meetings.length - 1].key);
    return {
      startMonth: new Date(start.y, start.m, 1),
      endMonth: new Date(end.y, end.m, 1),
    };
  }, [meetings]);

  const [viewYear, setViewYear] = useState(() => {
    if (meetings[0]) return parseKey(meetings[0].key).y;
    return new Date().getFullYear();
  });
  const [viewMonthIndex, setViewMonthIndex] = useState(() => {
    if (meetings[0]) return parseKey(meetings[0].key).m;
    return new Date().getMonth();
  });

  useEffect(() => {
    if (!selectedWeekKey) return;
    const p = parseKey(selectedWeekKey);
    setViewYear(p.y);
    setViewMonthIndex(p.m);
  }, [selectedWeekKey]);

  const goPrev = useCallback(() => {
    if (!bounds) return;
    const viewStart = new Date(viewYear, viewMonthIndex, 1);
    if (viewStart.getTime() <= bounds.startMonth.getTime()) return;
    const d = new Date(viewYear, viewMonthIndex - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonthIndex(d.getMonth());
  }, [bounds, viewYear, viewMonthIndex]);

  const goNext = useCallback(() => {
    if (!bounds) return;
    const viewStart = new Date(viewYear, viewMonthIndex, 1);
    if (viewStart.getTime() >= bounds.endMonth.getTime()) return;
    const d = new Date(viewYear, viewMonthIndex + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonthIndex(d.getMonth());
  }, [bounds, viewYear, viewMonthIndex]);

  if (meetings.length === 0 || !bounds) {
    return null;
  }

  const viewStart = new Date(viewYear, viewMonthIndex, 1);
  const canPrev = viewStart.getTime() > bounds.startMonth.getTime();
  const canNext = viewStart.getTime() < bounds.endMonth.getTime();

  const firstDow = new Date(viewYear, viewMonthIndex, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonthIndex + 1, 0).getDate();

  const cells: { day: number | null; inMonth: boolean }[] = [];
  for (let i = 0; i < firstDow; i++) {
    cells.push({ day: null, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, inMonth: false });
  }

  const dowLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const frameClass = embedded
    ? "rounded-lg bg-mkp-surface-subtle p-4 sm:p-5 border-b border-mkp-border pb-8 lg:border-b-0 lg:border-r lg:pb-5 lg:pr-8"
    : "rounded-xl border border-mkp-border bg-mkp-surface-subtle p-4 sm:p-5";

  return (
    <div className={frameClass}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          className="rounded-lg border border-mkp-border bg-mkp-surface px-3 py-1.5 text-sm font-medium text-mkp-ink hover:border-mkp-blue disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="text-center text-sm font-semibold text-mkp-ink">
          {monthNames[viewMonthIndex]} {viewYear}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          className="rounded-lg border border-mkp-border bg-mkp-surface px-3 py-1.5 text-sm font-medium text-mkp-ink hover:border-mkp-blue disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next month"
        >
          →
        </button>
      </div>
      <div
        className="mt-4 grid grid-cols-7 gap-1 text-center text-xs sm:text-sm"
        role="grid"
        aria-label="Meeting weeks"
      >
        {dowLabels.map((d) => (
          <div
            key={d}
            className="py-2 font-semibold uppercase tracking-wide text-mkp-muted"
          >
            {d}
          </div>
        ))}
        {cells.map((cell, idx) => {
          if (!cell.inMonth || cell.day === null) {
            return (
              <div key={idx} className="min-h-[2.5rem] sm:min-h-[2.75rem]" />
            );
          }
          const key = toKey(viewYear, viewMonthIndex, cell.day);
          const isMeeting = keySet.has(key);
          const isSelected = key === selectedWeekKey;

          if (!isMeeting) {
            return (
              <div
                key={idx}
                className="flex min-h-[2.5rem] items-center justify-center rounded-lg text-mkp-muted opacity-45 sm:min-h-[2.75rem]"
              >
                {cell.day}
              </div>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              role="gridcell"
              onClick={() => onSelectWeek(key)}
              aria-pressed={isSelected}
              className={`flex min-h-[2.5rem] items-center justify-center rounded-lg text-sm font-semibold transition-colors sm:min-h-[2.75rem] ${
                isSelected
                  ? "bg-mkp-blue text-white ring-2 ring-mkp-blue ring-offset-2 ring-offset-mkp-surface-subtle"
                  : "border-2 border-mkp-blue/40 bg-mkp-surface text-mkp-ink hover:bg-mkp-yellow-soft"
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
