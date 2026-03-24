"use client";

import { siteUrl } from "@/lib/site-config";

/**
 * Renders a scannable QR when NEXT_PUBLIC_SITE_URL is set; otherwise shows a short note.
 */
export function ContactQr() {
  const contactPath = "/contact";
  const absolute =
    siteUrl.length > 0 ? `${siteUrl}${contactPath}` : "";

  if (!absolute) {
    return (
      <div className="rounded-lg border border-dashed border-mkp-border bg-mkp-surface-subtle p-6 text-center text-sm text-mkp-muted">
        Set <code className="text-mkp-ink">NEXT_PUBLIC_SITE_URL</code> in{" "}
        <code className="text-mkp-ink">.env.local</code> to generate a QR
        that points to your live Contact page.
      </div>
    );
  }

  const src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    absolute,
  )}`;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- external QR API */}
      <img
        src={src}
        alt=""
        width={180}
        height={180}
        className="rounded-md border border-mkp-border bg-white p-2"
      />
      <p className="text-center text-xs text-mkp-muted">
        Scan to open the contact page on your phone.
      </p>
    </div>
  );
}
