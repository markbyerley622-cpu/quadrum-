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
 * on hover. The icons are sized to sit at the partner marks' optical weight;
 * a 36px app icon beside a 70px wordmark reads as a footnote.
 *
 * Unreleased apps are marked rather than hidden. A row of five where two are not
 * out yet is honest and still impressive; the same row with the unreleased ones
 * quietly presented as shipping is neither.
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
            className="group/app relative flex flex-col items-start gap-4
                       border border-rule bg-paper-raised px-5 py-5 sm:px-6
                       shadow-[0_1px_2px_rgb(20_19_15/0.04)]
                       transition-[border-color,box-shadow,transform] duration-[0.6s] ease-quad
                       hover:border-rule-strong
                       hover:shadow-[0_2px_4px_rgb(20_19_15/0.05),0_14px_28px_-16px_rgb(20_19_15/0.28)]
                       motion-safe:hover:-translate-y-0.5"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[0.7s] ease-quad motion-safe:group-hover/app:scale-x-100"
            />

            <span
              className="relative block shrink-0 overflow-hidden rounded-[11px] border border-rule"
              style={{ width: "clamp(2.75rem, 8vw, 3.25rem)", height: "clamp(2.75rem, 8vw, 3.25rem)" }}
            >
              <Image
                src={app.src}
                alt=""
                fill
                sizes="52px"
                // Already 256px and a few kilobytes each, and shown at 52. See
                // the note in LogoCloud: the optimizer has nothing to win here
                // and a transform is somewhere a stale variant can hide.
                unoptimized
                className={`object-cover transition-opacity duration-[0.7s] ease-quad ${
                  // Unreleased apps sit back rather than disappear — the mark is
                  // still the fastest way to recognise what the thing is.
                  app.soon ? "opacity-60 group-hover/app:opacity-100" : "opacity-100"
                }`}
              />
            </span>

            <span className="min-w-0">
              <span className="type-small block leading-[1.25] text-ink">{app.name}</span>
              <span className="type-label mt-2 block leading-[1.5] text-ink-25">
                {app.summary}
              </span>
              {app.soon ? (
                <span className="type-label mt-3 inline-flex items-center gap-1.5 text-accent">
                  <span aria-hidden className="size-[4px] shrink-0 rounded-full bg-accent" />
                  Soon
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
