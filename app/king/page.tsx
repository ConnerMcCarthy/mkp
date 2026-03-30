import type { Metadata } from "next";
import Link from "next/link";
import { KingSignup } from "./king-signup";
import { getWeekSnapshot, readIntentions } from "@/lib/intentions-store";
import { getUpcomingMeetingDates } from "@/lib/meeting-weeks";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "King signup",
  description: `Volunteer as King for an upcoming ${site.name} meeting.`,
};

export const dynamic = "force-dynamic";

export default async function KingPage() {
  const meetings = getUpcomingMeetingDates(8);
  const data = await readIntentions();
  const intentionsByWeek = Object.fromEntries(
    meetings.map((m) => [m.key, getWeekSnapshot(data, m.key)]),
  );
  const showStewardRelease = Boolean(process.env.STEWARD_SECRET);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 pb-14 sm:px-6">
      <p className="text-sm font-medium text-mkp-blue">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / King signup
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-mkp-ink">
        King signup
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-mkp-muted">
        Claim an open King slot for a circle night or add an optional note for
        the week. Data is stored with RSVPs in{" "}
        <code className="rounded bg-mkp-surface-subtle px-1 text-mkp-ink">
          data/intentions.json
        </code>
        .
      </p>

      <div className="mt-10">
        <KingSignup
          meetings={meetings}
          intentionsByWeek={intentionsByWeek}
          showStewardRelease={showStewardRelease}
        />
      </div>
    </main>
  );
}
