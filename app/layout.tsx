import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans, Roboto_Slab } from "next/font/google";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { site } from "@/lib/site-config";
import "./globals.css";

/** Univers / Helvetica-style body (PDF secondary + logo line). */
const mkpSans = IBM_Plex_Sans({
  variable: "--font-mkp-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Rockwell-style headlines (PDF primary display). */
const mkpHeading = Roboto_Slab({
  variable: "--font-mkp-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.org}`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mkpSans.variable} ${mkpHeading.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-mkp-ink">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
