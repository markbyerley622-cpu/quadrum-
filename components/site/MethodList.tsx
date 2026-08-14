"use client";

import { useState } from "react";
import { process } from "@/lib/content";

/**
 * Define → Design → Build → Evolve, as four numbers you open.
 *
 * This was a quadrant of four cells, each showing its stage, its summary and its
 * principle at once. Everything was legible and nothing was emphasised: four
 * equal blocks of body copy in a section whose entire subject is sequence and
 * discipline. The layout said "here are four things"; the content says "these
 * happen in an order, and each one earns the next".
 *
 * So the stages are numerals now — set at display size, which is the only place
 * on the page besides the count where type goes that large — and only one is
 * open. Opening the next closes the last. That is the section demonstrating what
 * it describes: a studio arguing for sequence should not present its sequence as
 * a grid you can read in any order.
 *
 * Mobile gets the same component rather than a different one, because a stack of
 * numbered rows that open in turn IS the vertical timeline this wants to be on a
 * phone. Nothing needed to be re-thought for the small screen; it was already the
 * shape that works there.
 *
 * The open row animates on `grid-template-rows`, which the compositor can
 * interpolate from 0fr to 1fr without anyone measuring anything. The obvious
 * alternative — reading `scrollHeight` and animating a pixel height — needs a
 * layout read on every open, and gets it wrong the moment the text rewraps.
 */
export function MethodList() {
  // Typed as a plain string rather than inferred from `process[0].index`, which
  // narrows to that one literal and makes "" — the all-closed state — invalid.
  const [open, setOpen] = useState<string>(process[0].index);

  return (
    <ul className="mt-14 border-t border-rule md:mt-20">
      {process.map((step) => {
        const active = step.index === open;

        return (
          <li key={step.index} className="border-b border-rule">
            <button
              type="button"
              // Toggling closed as well as open matters: a set of four where one
              // is always forced open cannot be returned to its resting state,
              // and the reader loses the overview the numerals exist to give.
              onClick={() => setOpen(active ? "" : step.index)}
              aria-expanded={active}
              className="group/step flex w-full items-baseline gap-6 py-7 text-left md:gap-10 md:py-9"
            >
              <span
                className={`type-display tnum shrink-0 text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.85] tracking-[-0.05em] transition-colors duration-500 ease-quad ${
                  active ? "text-accent" : "text-ink-25 group-hover/step:text-ink-45"
                }`}
              >
                {step.index}
              </span>

              <span
                className={`type-h2 min-w-0 flex-1 text-[clamp(1.8rem,4.4vw,3.4rem)] transition-colors duration-500 ease-quad ${
                  active ? "text-ink" : "text-ink-45 group-hover/step:text-ink"
                }`}
              >
                {step.title}
              </span>

              {/* A plus that becomes a minus. One rotated bar, no icon swap and
                  nothing to load. */}
              <span
                aria-hidden
                className={`relative mb-2 block size-3.5 shrink-0 transition-colors duration-500 ease-quad ${
                  active ? "text-accent" : "text-ink-25 group-hover/step:text-ink-45"
                }`}
              >
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                <span
                  className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-[0.55s] ease-quad ${
                    active ? "scale-y-0" : "scale-y-100"
                  }`}
                />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-[0.62s] ease-quad ${
                active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`pb-10 transition-opacity duration-[0.5s] ease-quad md:grid md:grid-cols-12 md:gap-x-10 md:pb-14 ${
                    active ? "opacity-100 delay-100" : "opacity-0"
                  }`}
                >
                  {/* Indented to clear the numeral, so the detail reads as
                      belonging to its stage rather than to the list. */}
                  <p className="type-lead measure text-ink-70 md:col-span-5 md:col-start-2">
                    {step.summary}
                  </p>

                  <figure className="mt-7 border-l border-accent/40 pl-5 md:col-span-5 md:col-start-8 md:mt-0">
                    <blockquote className="type-lead leading-[1.45] text-ink-45">
                      {step.principle}
                    </blockquote>
                  </figure>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
