"use client";

import { useScroll, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { constellation, site } from "@/lib/content";

/**
 * Act IV½ — six products drawing lines to one studio.
 *
 * The only screen on the site that argues by picture alone. The proof act has
 * already made the case for each product one at a time; what it cannot show,
 * spread by spread, is the thing a client is actually buying — that payments,
 * institutional liquidity, combat sports, property and enterprise AI came out of
 * the same room. A paragraph claiming that is an assertion. Six names drawing
 * lines into one name is a demonstration, and the closing line only appears
 * after the demonstration has finished making it.
 *
 * TWO PHASES, off one scroll value:
 *
 *   0.00 → 0.30   the connections draw, outward from the centre
 *   0.30 → 0.42   it holds, complete
 *   0.42 → 0.70   the products collapse into the studio, and the line lands
 *
 * The hold is deliberate: the constellation has to stand still and finished for
 * a moment before it contracts, or the reader never sees the shape that is being
 * collapsed. And everything is over by 0.70 rather than 1.00 for a blunter
 * reason — the last third of this section's scroll happens with the field
 * already leaving the top of the screen, so a collapse timed to the end is a
 * collapse the reader watches from behind.
 *
 * Everything is driven by ONE custom property. The lines consume it as a
 * dash offset, the nodes as a translation toward the centre, the studio name as
 * an opacity — so a scroll frame is a single style write, and adding a seventh
 * product would not add a subscriber.
 *
 * Under `prefers-reduced-motion` it renders in its resting state: connections
 * drawn, products in place, studio name and line present. The picture still
 * makes its argument; it simply does not perform it.
 */
export function Constellation() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.style.setProperty("--draw", "1");
      el.style.setProperty("--collapse", "0");
      el.style.setProperty("--studio", "1");
      return;
    }

    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

    const apply = (p: number) => {
      el.style.setProperty("--draw", clamp(p / 0.3).toFixed(4));
      el.style.setProperty("--collapse", clamp((p - 0.42) / 0.28).toFixed(4));
      el.style.setProperty("--studio", clamp((p - 0.4) / 0.18).toFixed(4));
    };

    apply(scrollYProgress.get());
    return scrollYProgress.on("change", apply);
  }, [reduced, scrollYProgress]);

  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden bg-void py-24 md:py-32"
    >
      {/* The three properties live here, on the ancestor of BOTH the field and
          the closing line — the line fades in off `--studio` too, and a custom
          property set on the field alone would not reach it. */}
      <div
        ref={ref}
        className="container-page"
        style={{
          ["--draw" as string]: 0,
          ["--collapse" as string]: 0,
          ["--studio" as string]: 0,
        }}
      >
        <Eyebrow invert>{constellation.act}</Eyebrow>

        {/* `--spread` narrows the ring horizontally on a phone.

            The field is laid out in percentages of its own box, and the two
            products at x=14 and x=18 are named "BNBPay" and "Combat Reviews" —
            set at `type-h3` and unwrappable, those names are wider than the
            distance between their node and the edge of a 393px screen. So the
            ring was being drawn correctly and rendered as two columns of type
            running off both sides of the section, clipped by its own
            `overflow-hidden`.

            Rather than shrink the type until it fits, the ring itself is
            compressed toward the vertical axis: every node's horizontal offset
            from the centre is multiplied by this, and the SVG carrying the
            connections is scaled by exactly the same factor about its own
            centre — so the lines still land on the nodes. At 1 it is the ring
            the desktop has always drawn. */}
        <div
          className="relative mx-auto mt-12 aspect-[3/4] w-full max-w-[64rem] [--spread:0.5] sm:aspect-[4/3] sm:[--spread:0.78] lg:mt-16 lg:aspect-[16/10] lg:[--spread:1]"
        >
          {/* The connections. One line per product, drawn from the centre
              outwards by running a dash offset to zero.

              The dash is ONE segment longer than any line in the field rather
              than a normalised `pathLength` of 1, and the stroke scales with the
              box rather than using `non-scaling-stroke`. Both were tried the
              other way and both broke: `preserveAspectRatio="none"` is required
              for the SVG's coordinates to agree with the nodes' CSS percentages,
              and under that non-uniform scale a normalised dash pattern is
              measured in distorted units — the lines rendered as a dotted mess
              rather than as six connections. With a single dash longer than the
              path there is no pattern left to distort. */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full origin-center"
            style={{ transform: "scaleX(var(--spread))" }}
          >
            {constellation.nodes.map((node) => (
              <line
                key={node.name}
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke="var(--color-rule-invert-strong)"
                strokeWidth="0.18"
                strokeDasharray="120"
                style={{ strokeDashoffset: "calc(120 * (1 - var(--draw)))" }}
              />
            ))}
          </svg>

          {constellation.nodes.map((node) => (
            <div
              key={node.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                // The same compression the connections get, applied to the node
                // that sits at the end of one. Both are offsets from the centre
                // scaled by `--spread`, which is why they cannot disagree.
                left: `calc(50% + ${node.x - 50} * var(--spread) * 1%)`,
                top: `${node.y}%`,
                // Collapse pulls each product back along its own line to the
                // centre — the distance is its own offset from 50%, so nothing
                // needs to know about anything else.
                transform: `
                  translate(-50%, -50%)
                  translate(
                    calc((50 - ${node.x}) * var(--collapse) * var(--spread) * 1%),
                    calc((50 - ${node.y}) * var(--collapse) * 1%)
                  )
                  scale(calc(1 - var(--collapse) * 0.35))
                `,
                opacity: "calc(var(--draw) * (1 - var(--collapse)))",
              }}
            >
              {/* The name keeps `type-h3`'s shape and takes a smaller size on a
                  phone, where two of these sit level with each other either
                  side of the field and the clamp's 24px floor put them within
                  nine pixels of touching. */}
              <p className="whitespace-nowrap text-[1.0625rem] leading-[1.08] tracking-[-0.028em] text-bone sm:text-[1.5rem] lg:text-[clamp(1.5rem,2.9vw,2.4rem)]">
                {node.name}
              </p>
              {/* The fact wraps below `sm` instead of running. "Every major
                  promotion" set on one line is wider than the gap between its
                  own node and the next one along. */}
              <p className="type-label mx-auto mt-2 max-w-[11ch] text-bone-35 sm:max-w-none sm:whitespace-nowrap">
                {node.fact}
              </p>
            </div>
          ))}

          {/* The studio, arriving as the products fold into it. */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              opacity: "var(--studio)",
              transform: `
                translate(-50%, -50%)
                scale(calc(0.86 + var(--studio) * 0.14))
              `,
            }}
          >
            <p className="type-h2 text-bone">{site.name}</p>
          </div>
        </div>

        {/* The line the picture has just earned. It is the only sentence in the
            section, and it says what the animation showed rather than
            introducing anything the reader has not already watched happen. */}
        <p
          className="type-pitch mx-auto mt-12 max-w-[24ch] text-center text-bone lg:mt-16"
          style={{ opacity: "var(--studio)" }}
        >
          {constellation.statement.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
