import type { Metadata } from "next";
import Link from "next/link";
import { NextMeetingCard } from "../components/next-meeting-card";
import { ScheduleIntentions } from "./schedule-intentions";
import { getWeekSnapshot, readIntentions } from "@/lib/intentions-store";
import { getUpcomingMeetingDates } from "@/lib/meeting-weeks";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Schedule",
  description: `When and where ${site.name} meets.`,
};

/** Fresh intentions + RSVPs on each load */
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const meetings = getUpcomingMeetingDates(8);
  const data = await readIntentions();
  const intentionsByWeek = Object.fromEntries(
    meetings.map((m) => [m.key, getWeekSnapshot(data, m.key)]),
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 pb-14 sm:px-6">
      <p className="text-sm font-medium text-mkp-blue">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Schedule
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-mkp-ink">
        Schedule
      </h1>

      <div className="mt-10">
        <NextMeetingCard />
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-mkp-ink">
          RSVP for upcoming meetings
        </h2>
        <ScheduleIntentions
          meetings={meetings}
          intentionsByWeek={intentionsByWeek}
        />
      </div>
    </main>
  );
}
