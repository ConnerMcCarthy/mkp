"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Old “/qr” URL — the QR now lives in the site footer. Send visitors there.
 */
export default function QrLegacyPage() {
  useEffect(() => {
    window.location.replace("/#site-qr");
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-mkp-ink">Taking you to the site QR in the footer…</p>
      <p className="mt-4 text-sm text-mkp-muted">
        <Link href="/#site-qr" className="font-medium text-mkp-blue hover:underline">
          Open footer section
        </Link>{" "}
        if nothing happens.
      </p>
    </main>
  );
}
