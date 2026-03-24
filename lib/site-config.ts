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
  /** IANA timezone for meeting times */
  timezone: "America/New_York",
  /** Repeat weekly: day 0 = Sunday … 6 = Saturday */
  meetingWeekday: 3 as const, // Wednesday example
  meetingStartLocal: "19:00",
  meetingEndLocal: "21:00",
  meetingLocation: "In person — update this address or link to map.",
  meetingLocationNote:
    "Replace with your venue, Zoom link, or hybrid details.",
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
