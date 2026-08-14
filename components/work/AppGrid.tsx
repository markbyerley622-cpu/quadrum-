import Image from "next/image";
import type { App } from "@/lib/content";

/**
 * The rest of the family: sibling apps that ship on the same infrastructure as
 * the product above them.
 *
 * This is a different argument from the partner strip beside it. A partner mark
 * is borrowed credibility — somebody else's name next to the work. This is the
 * opposite: evidence that what was built underneath was general enough to carry
 * five products instead of one, which is the only claim in the act that speaks
 * to the engineering rather than to the result.
 *
 * It shares the partner strip's tile so the two rows read as one system on the
 * spread they both appear on — same hairline, same paper surface, same accent
 * on hover. The icons are sized to sit at the partner marks' optical weight; a
 * 36px app icon beside a 70px wordmark reads as a footnote.
 *
 * A shipped app makes its whole tile a link. An unreleased one is marked rather
 * than hidden: a row of five where two are not out yet is honest and still
 * impressive, and the same row with the unreleased ones quietly presented as
 * shipping is neither.
 */
export function AppGrid({ label, items }: { label: string; items: readonly App[] }) {
  return (
    <div>
      <p className="type-label text-ink-45">{label}</p>

      {/* Two up on a phone, then as many as fit. A five-item row that wraps to
          one per line on mobile turns a compact proof into a scroll of its own. */}
      <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        {items.map((app) => (
          <li
            key={app.name}
            className="group/app relative border border-rule bg-paper-raised
                       shadow-[0_1px_2px_rgb(20_19_15/0.04)]
                       transition-[border-color,box-shadow,transform] duration-[0.6s] ease-quad
                       hover:border-rule-strong
                       hover:shadow-[0_2px_4px_rgb(20_19_15/0.05),0_14px_28px_-16px_rgb(20_19_15/0.28)]
                       motion-safe:hover:-translate-y-0.5"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-accent transition-transform duration-[0.7s] ease-quad motion-safe:group-hover/app:scale-x-100"
            />

            <Tile app={app} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The tile's contents, as a link where the app is live and a plain block where
 * it is not.
 *
 * The link wraps the whole tile rather than sitting inside it as a separate
 * "visit" affordance: at this size there is no room for one, and a card whose
 * icon and name are not the target is a card people click and nothing happens.
 */
function Tile({ app }: { app: App }) {
  const body = (
    <>
      <span className="relative flex w-full items-start justify-between gap-2">
        <span
          className="relative block shrink-0 overflow-hidden rounded-[11px] border border-rule"
          style={{ width: "clamp(2.75rem, 8vw, 3.25rem)", height: "clamp(2.75rem, 8vw, 3.25rem)" }}
        >
          <Image
            src={app.src}
            alt=""
            fill
            sizes="52px"
            // Already 256px and a few kilobytes each, and shown at 52. See the
            // note in LogoCloud: the optimizer has nothing to win here and a
            // transform is somewhere a stale variant can hide.
            unoptimized
            className={`object-cover transition-opacity duration-[0.7s] ease-quad ${
              // Unreleased apps sit back rather than disappear — the mark is
              // still the fastest way to recognise what the thing is.
              app.soon ? "opacity-60 group-hover/app:opacity-100" : "opacity-100"
            }`}
          />
        </span>

        {app.href ? (
          <span
            aria-hidden
            className="mt-1 block shrink-0 text-ink-25 transition-[color,transform] duration-[0.7s] ease-quad group-hover/app:text-accent motion-safe:group-hover/app:translate-x-0.5"
          >
            <svg viewBox="0 0 12 12" className="size-3" fill="none">
              <path d="M2.5 9.5 L9.5 2.5 M4 2.5 h5.5 v5.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        ) : null}
      </span>

      <span className="min-w-0">
        <span className="type-body block font-medium leading-[1.25] text-ink">{app.name}</span>
        {/* Sentence case, body size. "BUY AMAZON PRODUCTS WITH CRYPTO" in 11px
            tracked caps wrapped to three lines on a phone, which is a sentence
            rendered as a pattern. */}
        <span className="type-small mt-2 block leading-[1.45] text-ink-45">{app.summary}</span>
        {app.soon ? (
          <span className="type-label mt-3 inline-flex items-center gap-1.5 text-accent">
            <span aria-hidden className="size-[4px] shrink-0 rounded-full bg-accent" />
            Soon
          </span>
        ) : null}
      </span>
    </>
  );

  const layout = "flex h-full flex-col items-start gap-4 px-5 py-5 sm:px-6";

  if (!app.href) return <div className={layout}>{body}</div>;

  return (
    <a
      href={app.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${app.name} — ${app.summary}, opens in a new tab`}
      className={layout}
    >
      {body}
    </a>
  );
}
