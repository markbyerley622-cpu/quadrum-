import type { Metadata } from "next";
import { Logomark } from "@/components/site/Logo";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-between py-10">
      <div className="container-page">
        <a href="/" className="inline-flex items-center gap-2.5" aria-label={`${site.name} — home`}>
          <Logomark className="size-[18px]" />
          <span className="text-[0.95rem] font-medium tracking-[-0.03em]">{site.name}</span>
        </a>
      </div>

      <div className="container-page">
        <p className="type-label text-ink-45">Error 404</p>
        <h1 className="type-h2 mt-7 -ml-[0.04em] max-w-[14ch]">
          This page does not exist.
        </h1>
        <p className="type-body measure mt-7 text-ink-70">
          The address may be mistyped, or the page may have been retired. The
          studio, the work and the contact details are all on the home page.
        </p>
        <a
          href="/"
          className="group relative mt-10 inline-flex items-center overflow-hidden border border-rule-strong px-6 py-3.5 transition-colors duration-500 hover:border-ink"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
          />
          <span className="type-label relative transition-colors duration-500 group-hover:text-paper">
            Return home
          </span>
        </a>
      </div>

      <div className="container-page">
        <p className="type-label text-ink-25">
          © {site.founded} {site.name}
        </p>
      </div>
    </main>
  );
}
