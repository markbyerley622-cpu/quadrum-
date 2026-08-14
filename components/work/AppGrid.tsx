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
 * Unreleased apps are marked rather than hidden. A row of five where two are not
 * out yet is honest and still impressive; the same row with the unreleased ones
 * quietly presented as shipping is neither.
 */
export function AppGrid({ label, items }: { label: string; items: readonly App[] }) {
  return (
    <div>
      <p className="type-label text-ink-25">{label}</p>

      {/* Two up on a phone, then as many as fit. A five-item row that wraps to
          1-per-line on mobile turns a compact proof into a scroll of its own. */}
      <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((app) => (
          <li key={app.name} className="flex items-start gap-3">
            <span className="relative block size-9 shrink-0 overflow-hidden rounded-[9px] border border-rule">
              <Image
                src={app.src}
                alt=""
                fill
                sizes="36px"
                className={`object-cover transition-opacity duration-[0.7s] ease-quad ${
                  // Unreleased apps sit back rather than disappear — the mark is
                  // still the fastest way to recognise what the thing is.
                  app.soon ? "opacity-55" : "opacity-100"
                }`}
              />
            </span>

            <span className="min-w-0">
              <span className="type-small block leading-[1.3] text-ink">{app.name}</span>
              <span className="type-label mt-1.5 block leading-[1.5] text-ink-25">
                {app.summary}
              </span>
              {app.soon ? (
                <span className="type-label mt-2 inline-flex items-center gap-1.5 text-accent">
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
