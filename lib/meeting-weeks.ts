import { addDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { site } from "./site-config";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Calendar dates (YYYY-MM-DD in `site.timezone`) for upcoming circle nights. */
export function getUpcomingMeetingDates(
  count: number,
): { key: string; label: string }[] {
  const tz = site.timezone;
  const targetName = WEEKDAY_NAMES[site.meetingWeekday];
  const result: { key: string; label: string }[] = [];
  const todayStart = new Date();

  for (let i = 0; i < 120 && result.length < count; i++) {
    const day = addDays(todayStart, i);
    const weekday = formatInTimeZone(day, tz, "EEEE");
    if (weekday === targetName) {
      const key = formatInTimeZone(day, tz, "yyyy-MM-dd");
      const label = formatInTimeZone(day, tz, "EEEE, MMMM d, yyyy");
      result.push({ key, label });
    }
  }

  return result;
}
