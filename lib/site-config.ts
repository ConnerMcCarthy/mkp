/**
 * Edit this file to match your circle. Set NEXT_PUBLIC_SITE_URL in .env.local
 * for correct QR codes and absolute links in production.
 */
export const siteUrl =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
  process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "";

export const site = {
  name: "MKP Hendersonville",
  org: "Mankind Project USA",
  tagline: "A weekly support group for men — newcomers welcome.",
  /**
   * Used in the footer QR when NEXT_PUBLIC_SITE_URL is not set. Replace with
   * your real domain before printing handouts, or set the env var instead.
   */
  publicUrlPlaceholder: "https://mkphendo.com",
  /**
   * IANA zone for computing “next meeting” dates. UI shows `timezoneLabel`
   * (EST) for consistency with how the circle talks about time.
   */
  timezone: "America/New_York",
  /** Shown everywhere we mention the zone (e.g. EST). */
  timezoneLabel: "EST",
  /** Repeat weekly: day 0 = Sunday … 6 = Saturday */
  meetingWeekday: 0 as const, // Sundays
  /** 12-hour times, local to the circle */
  meetingStartDisplay: "5:00 PM",
  meetingEndDisplay: "7:00 PM",
  meetingLocation: "900 Blythe St, Hendersonville, NC 28791",
  meetingLocationNote: "In person.",
  /** Placeholder links — swap for your Google Group, Drive PDFs, etc. */
  links: {
    googleGroup: "https://groups.google.com/",
    mkpUsa: "https://mankindproject.org/",
    kingSignup: "https://mankindproject.org/",
    pdfWelcome: "#",
  },
  contacts: {
    circleEmail: "circle@example.org",
    stewardName: "Circle steward (update name)",
    stewardPhone: "",
  },
} as const;

export function getMeetingTimeRangeLabel(): string {
  return `${site.meetingStartDisplay} – ${site.meetingEndDisplay}`;
}

export function getMeetingWeekdayLabel(): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[site.meetingWeekday];
}
