"use client";

import { useScroll, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { engagement } from "@/lib/content";

/**
 * The fourteen days, as a timeline that actually runs.
 *
 * This has been a scroll-pinned sequence over 280vh — the most expensive thing
 * on the page — and then four dated columns in a row, which said the same in one
 * screen and cost nothing. The columns were right about length and wrong about
 * substance: four boxes side by side describe a fortnight the way a table of
 * contents describes a book. Nothing about them was sequential, and sequence is
 * the entire promise. Day 1 to Day 14 is the offer.
 *
 * So it is a vertical rail the reader's own scroll fills in. Each of the four
 * moments lights as the fill reaches it, and by the closing line the fortnight
 * has visibly completed. That is worth the small amount of machinery: this
 * section is the only thing on the page a reader can say yes to, and it should
 * feel like a process running rather than a list of deliverables.
 *
 * Vertical at every size, deliberately. A horizontal rail would have to become a
 * vertical one on a phone anyway, and time reading downwards as the page scrolls
 * down is the more natural mapping on both — the reader's motion IS the
 * fortnight's progress, in the same direction.
 *
 * ONE DOM WRITE DRIVES EVERYTHING. The scroll subscriber sets a single custom
 * property on the container; the rail's fill consumes it in a transform and
 * never touches React. Only the count of lit stations is state, and it changes
 * four times over the whole section rather than on every frame.
 */
export function Fortnight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts as the first moment clears the lower third of the screen and
    // completes a little before the block leaves, so the last station lights
    // while the reader can still see it rather than on the way out.
    offset: ["start 75%", "end 65%"],
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.style.setProperty("--fortnight", "1");
      setLit(engagement.moments.length);
      return;
    }

    const apply = (value: number) => {
      const p = Math.min(Math.max(value, 0), 1);
      el.style.setProperty("--fortnight", String(p));

      const reached = Math.min(Math.ceil(p * engagement.moments.length), engagement.moments.length);
      setLit((current) => (current === reached ? current : reached));
    };

    apply(scrollYProgress.get());
    return scrollYProgress.on("change", apply);
  }, [reduced, scrollYProgress]);

  return (
    <div ref={ref} style={{ ["--fortnight" as string]: 0 }}>
      <ol className="relative">
        {/* The rail, and the accent filling it. Both sit behind the content and
            are hidden from the reader's software — the dates already say
            everything the line is drawing. */}
        <span
          aria-hidden
          className="absolute bottom-0 left-[3px] top-0 w-px bg-rule md:left-[5px]"
        >
          <span
            className="block h-full w-full origin-top bg-accent"
            style={{ transform: "scaleY(var(--fortnight))" }}
          />
        </span>

        {engagement.moments.map((moment, i) => {
          const reached = i < lit;

          return (
            <li key={moment.index} className="relative pl-8 md:pl-14">
              <span
                aria-hidden
                className={`absolute left-0 top-[1.55rem] block size-[7px] rounded-full border transition-[background-color,border-color,transform] duration-[0.55s] ease-quad md:size-[11px] ${
                  reached
                    ? "border-accent bg-accent md:scale-100"
                    : "border-rule-strong bg-paper-sunk"
                }`}
              />

              <div
                className={`border-b border-rule py-6 transition-opacity duration-[0.6s] ease-quad md:py-9 ${
                  // Unreached moments recede rather than hide: the reader can
                  // still read ahead, they just are not being shown it yet.
                  reached ? "opacity-100" : "opacity-55"
                }`}
              >
                <div className="md:grid md:grid-cols-12 md:gap-x-10">
                  <p
                    className={`type-label tnum transition-colors duration-[0.55s] ease-quad md:col-span-3 ${
                      reached ? "text-accent" : "text-ink-25"
                    }`}
                  >
                    {moment.days}
                  </p>

                  <div className="mt-3 md:col-span-9 md:mt-0">
                    <h3 className="type-h4 max-w-[22ch]">{moment.title}</h3>
                    <p className="type-small measure mt-3 max-w-[62ch] text-ink-45">
                      {moment.body}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* The conclusion the sequence earns. It lands only once the rail has
          actually reached the end, so the page never claims the fortnight is
          finished while the reader is still in the middle of it. */}
      <p
        className={`type-h3 mt-10 max-w-[24ch] transition-[opacity,transform] duration-[0.8s] ease-quad md:mt-14 ${
          lit === engagement.moments.length
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        {engagement.close}
      </p>
    </div>
  );
}
