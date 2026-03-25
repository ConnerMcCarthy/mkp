import { site, siteUrl } from "@/lib/site-config";

export function FooterSiteQr() {
  const usingEnv = siteUrl.length > 0;
  const targetUrl = usingEnv ? siteUrl : site.publicUrlPlaceholder;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    targetUrl,
  )}`;

  return (
    <div
      id="site-qr"
      className="mt-8 scroll-mt-8 border-t border-mkp-border pt-8"
    >
      <p className="text-sm font-semibold text-mkp-ink">Open this site on your phone</p>
      <p className="mt-2 text-xs text-mkp-muted">
        Scan with a camera — opens the homepage in a browser.
      </p>

      {!usingEnv ? (
        <p className="mt-3 rounded-lg border border-mkp-yellow/60 bg-mkp-yellow-soft px-3 py-2 text-xs text-mkp-ink">
          <strong className="text-mkp-yellow">Placeholder URL.</strong> Encodes{" "}
          <code className="rounded bg-white/80 px-1 text-mkp-ink">
            {site.publicUrlPlaceholder}
          </code>
          . Set <code className="text-mkp-ink">NEXT_PUBLIC_SITE_URL</code> or edit{" "}
          <code className="text-mkp-ink">publicUrlPlaceholder</code> in{" "}
          <code className="text-mkp-ink">lib/site-config.ts</code> before printing.
        </p>
      ) : (
        <p className="mt-3 text-xs text-mkp-muted">
          <span className="font-medium text-mkp-ink">{targetUrl}</span>
        </p>
      )}

      <div className="mt-4 flex flex-col items-start sm:flex-row sm:items-end sm:gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- external QR API */}
        <img
          src={qrSrc}
          alt={`QR code for ${targetUrl}`}
          width={200}
          height={200}
          className="rounded-md border border-mkp-border bg-white p-2"
        />
        <p className="mt-3 max-w-sm text-xs text-mkp-muted sm:mt-0 sm:pb-2">
          Use for handouts, slides, or signs — same code site-wide.
        </p>
      </div>
    </div>
  );
}
